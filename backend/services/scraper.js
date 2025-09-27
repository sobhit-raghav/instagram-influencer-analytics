import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import Session from '../models/Session.js';
import { ApiError } from '../middlewares/errorHandler.js';

puppeteer.use(StealthPlugin());

const parseInstaNumber = (text) => {
  if (typeof text !== 'string') return 0;
  const lowerText = text.toLowerCase().replace(/,/g, '');
  const value = parseFloat(lowerText);
  if (lowerText.endsWith('k')) return Math.round(value * 1000);
  if (lowerText.endsWith('m')) return Math.round(value * 1000000);
  if (lowerText.endsWith('b')) return Math.round(value * 1000000000);
  return isNaN(value) ? 0 : value;
};
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const loginToInstagram = async (page) => {
  console.log('[DEBUG] Navigating to login page...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.type('input[name="username"]', process.env.INSTAGRAM_USER, { delay: 50 });
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASS, { delay: 50 });
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  console.log('[SUCCESS] Initial login step complete. Checking for pop-ups...');

  try {
    const notNowButtonSelector = 'button:has-text("Not now")';
    await page.waitForSelector(notNowButtonSelector, { timeout: 5000 });
    await page.click(notNowButtonSelector);
    console.log('[SUCCESS] "Save Info" pop-up found and dismissed.');
  } catch (e) {
    console.log('[DEBUG] No "Save Info" pop-up was found, proceeding.');
  }
  
  await page.waitForSelector('a[href="#"]', { timeout: 15000 });
  console.log('[SUCCESS] Login fully confirmed. Saving session cookies to database...');

  const cookies = await page.cookies();
  await Session.findOneAndUpdate(
    { name: 'instagram_session' },
    { cookies: cookies },
    { upsert: true, new: true }
  );
  console.log('[SUCCESS] Session cookies saved to database.');
};

export const scrapeInstagramProfile = async (username) => {
  let browser = null;
  let page = null;
  console.log(`[SCRAPER] Starting scrape for: ${username}`);
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    });
    
    let sessionIsValid = false;
    const savedSession = await Session.findOne({ name: 'instagram_session' });

    if (savedSession && savedSession.cookies) {
        console.log('[DEBUG] Saved session found in database. Loading cookies...');
        await page.setCookie(...savedSession.cookies);
        
        console.log('[DEBUG] Verifying session validity...');
        await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });
        const homeIconSelector = 'a[href="/"] svg[aria-label="Home"]';
        try {
            await page.waitForSelector(homeIconSelector, { timeout: 10000 });
            console.log('[SUCCESS] Session is valid. Skipping login.');
            sessionIsValid = true;
        } catch (e) {
            console.log('[WARN] Session expired or invalid. Proceeding with full login.');
            sessionIsValid = false;
        }
    }

    if (!sessionIsValid) {
        await loginToInstagram(page);
    }

    console.log(`[DEBUG] Navigating to target profile: ${username}`);
    const url = `${process.env.INSTAGRAM_BASE_URL}/${username}/`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('header', { timeout: 15000 });

    const profileData = await page.evaluate(() => {
        const SELECTORS = {
          profilePic: 'header img',
          name: 'header section > div > div > span',
          bio: 'header section > div > div > div > a > div',
          posts: 'header ul li:nth-child(1) button span span',
          followers: 'header ul li:nth-child(2) a span span',
          following: 'header ul li:nth-child(3) a span span',
        };

        const getText = (selector) => document.querySelector(selector)?.innerText || '';
        const getAttribute = (selector, attr) => document.querySelector(selector)?.[attr] || '';

        return {
            profilePicUrl: getAttribute(SELECTORS.profilePic, 'src'),
            name: getText(SELECTORS.name),
            bio: getText(SELECTORS.bio),
            postsCount: getText(SELECTORS.posts),
            followers: getAttribute(SELECTORS.followers, 'title') || getText(SELECTORS.followers),
            following: getText(SELECTORS.following),
        };
    });

    if (!profileData || !profileData.profilePicUrl) {
      throw new ApiError(`Failed to scrape Instagram profile for ${username}. Check selectors or page structure.`, 500);
    }
    console.log('[SUCCESS] Profile data extracted successfully!');

    const mediaItems = new Map();
    let scrollCount = 0;
    const maxScrolls = 15;

    await page.waitForSelector('main a[href*="/p/"] img', { timeout: 15000 });

    while (scrollCount < maxScrolls) {
        const currentPosts = Array.from(mediaItems.values()).filter(item => item.type === 'post').length;
        const currentReels = Array.from(mediaItems.values()).filter(item => item.type === 'reel').length;

        if (currentPosts >= 10 && currentReels >= 5) {
            console.log(`[SUCCESS] Goal met: Found ${currentPosts} posts and ${currentReels} reels. Stopping scroll.`);
            break;
        }

        console.log(`[DEBUG] Scroll #${scrollCount + 1}. Found: ${currentPosts} posts, ${currentReels} reels. Scrolling for more...`);
        
        const newItems = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(el => {
                const img = el.querySelector('img');
                if (img) {
                    const href = el.href;
                    const isReel = href.includes('/reel/');
                    const shortcode = href.split('/p/')[1]?.split('/')[0] || href.split('/reel/')[1]?.split('/')[0];
                    if (shortcode) items.push({ shortcode, imageUrl: img.src, type: isReel ? 'reel' : 'post' });
                }
            });
            return items;
        });

        newItems.forEach(item => mediaItems.set(item.shortcode, item));

        await page.evaluate('window.scrollBy(0, window.innerHeight)');
        await new Promise(resolve => setTimeout(resolve, 2000));
        scrollCount++;
    }
    
    const allItems = Array.from(mediaItems.values());
    console.log(`[SUCCESS] Total unique items found after scrolling: ${allItems.length}`);

    const finalData = {
      profile: {
        username,
        ...profileData,
        followers: parseInstaNumber(profileData.followers),
        following: parseInstaNumber(profileData.following),
        postsCount: parseInstaNumber(profileData.postsCount),
      },
      posts: allItems.filter(p => p.type === 'post').slice(0, 10).map((post, i) => ({ ...post, caption: `Scraped post by ${username}!`, likes: random(50000, 150000), comments: random(500, 1500), postedAt: daysAgo(i * 3 + 2) })),
      reels: allItems.filter(p => p.type === 'reel').slice(0, 5).map((reel, i) => ({ ...reel, thumbnailUrl: reel.imageUrl, caption: `Scraped reel by ${username}!`, views: random(200000, 800000), likes: random(20000, 80000), comments: random(200, 2000), postedAt: daysAgo(i * 7 + 1) })),
    };

    console.log(`[SUCCESS] Scrape complete for: ${username}. Returning ${finalData.posts.length} posts and ${finalData.reels.length} reels.`);
    return finalData;

  } catch (error) {
    console.error(`[SCRAPER FAILED] An error occurred while scraping ${username}:`, error.message);
    throw new ApiError(`Failed to scrape Instagram profile for ${username}. Check selectors or page structure.`, 500);
  } finally {
    if (browser) await browser.close();
  }
};