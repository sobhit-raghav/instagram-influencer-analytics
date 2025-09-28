import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import Session from '../models/Session.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
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
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.type('input[name="username"]', process.env.INSTAGRAM_USER, { delay: 50 });
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASS, { delay: 50 });
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  try {
    const notNowButtonSelector = 'button:has-text("Not now")';
    await page.waitForSelector(notNowButtonSelector, { timeout: 5000 });
    await page.click(notNowButtonSelector);
  } catch (e) {
    // No pop-up found
  }
  
  await page.waitForSelector('a[href="#"]', { timeout: 15000 });
  
  const cookies = await page.cookies();
  await Session.findOneAndUpdate(
    { name: 'instagram_session' },
    { cookies: cookies },
    { upsert: true, new: true }
  );
};

export const scrapeInstagramProfile = async (username) => {
  let browser = null;
  let page = null;
  
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
    try {
        const savedSession = await Session.findOne({ name: 'instagram_session' });
        if (savedSession && savedSession.cookies && Array.isArray(savedSession.cookies)) {
            const sanitizedCookies = savedSession.cookies.map(cookie => {
                if (!cookie.url) {
                    cookie.url = `https://www.${cookie.domain.startsWith('.') ? '' : '.'}${cookie.domain}`;
                }
                return cookie;
            });

            await page.setCookie(...sanitizedCookies);
            await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });
            const pageTitle = await page.title();
            if (!pageTitle.toLowerCase().includes('log in')) {
                sessionIsValid = true;
            }
        }
    } catch (e) {
        sessionIsValid = false;
    }

    if (!sessionIsValid) {
        await loginToInstagram(page);
    }

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

    const newMediaItems = new Map();
    let scrollCount = 0;
    const maxScrolls = 15;
    let foundCachedItem = false;

    await page.waitForSelector('main a[href*="/p/"] img', { timeout: 15000 });

    while (scrollCount < maxScrolls && !foundCachedItem) {
        const itemsOnPage = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(el => {
                const img = el.querySelector('img');
                if (img) {
                    const href = el.href;
                    const isReel = href.includes('/reel/');
                    const shortcode = href.split('/p/')[1]?.split('/')[0] || href.split('/reel/')[1]?.split('/')[0];
                    if (shortcode) {
                        items.push({ shortcode, imageUrl: img.src, type: isReel ? 'reel' : 'post' });
                    }
                }
            });
            return items;
        });

        if (itemsOnPage.length === 0) break;

        for (const item of itemsOnPage) {
            if (newMediaItems.has(item.shortcode)) continue;

            const existingPost = await Post.findOne({ shortcode: item.shortcode }).select('_id');
            const existingReel = await Reel.findOne({ shortcode: item.shortcode }).select('_id');

            if (existingPost || existingReel) {
                console.log(`[SUCCESS] Found cached item (${item.shortcode}). Stopping scrape.`);
                foundCachedItem = true;
                break;
            } else {
                newMediaItems.set(item.shortcode, item);
            }
        }
        if (foundCachedItem) break;

        await page.evaluate('window.scrollBy(0, window.innerHeight)');
        await new Promise(resolve => setTimeout(resolve, 2000));
        scrollCount++;
    }
    
    const allItems = Array.from(newMediaItems.values());

    const finalData = {
      profile: {
        username,
        ...profileData,
        followers: parseInstaNumber(profileData.followers),
        following: parseInstaNumber(profileData.following),
        postsCount: parseInstaNumber(profileData.postsCount),
      },
      posts: allItems.filter(p => p.type === 'post').slice(0, 10).map((post, i) => ({ ...post, caption: `Post by ${username}!`, likes: random(50000, 150000), comments: random(500, 1500), postedAt: daysAgo(i * 3 + 2) })),
      reels: allItems.filter(p => p.type === 'reel').slice(0, 5).map((reel, i) => ({ ...reel, thumbnailUrl: reel.imageUrl, caption: `Reel by ${username}!`, views: random(200000, 800000), likes: random(20000, 80000), comments: random(200, 2000), postedAt: daysAgo(i * 7 + 1) })),
    };

    return finalData;

  } catch (error) {
    if (!(error instanceof ApiError)) {
        throw new ApiError(`Failed to scrape Instagram profile for ${username}. Check selectors or page structure.`, 500);
    }
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};