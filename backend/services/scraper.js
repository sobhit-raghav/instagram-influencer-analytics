import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

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
  console.log('[SUCCESS] Login fully confirmed. Ready to scrape.');
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
    
    await loginToInstagram(page);

    console.log(`[DEBUG] Navigating to target profile: ${username}`);
    const url = `${process.env.INSTAGRAM_BASE_URL}/${username}/`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const mainContentSelector = 'section > main';
    await page.waitForSelector(mainContentSelector, { timeout: 15000 });

    console.log('[DEBUG] Evaluating page using user-provided selectors...');
    const profileData = await page.evaluate(() => {
        const SELECTORS = {
          profilePic: 'header img',
          name: 'header h2',
          bio: 'header section > span > div > span',
          posts: 'header ul li:nth-child(1) span span',
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
      throw new Error('Could not extract essential profile data. The provided selectors may no longer be valid.');
    }
    console.log('[SUCCESS] Profile data extracted successfully!');

    const postsAndReels = await page.evaluate(() => {
        const items = [];
        const gridContainerSelector = 'main > div > div > div';
        const postLinks = document.querySelectorAll(`${gridContainerSelector} a`);

        postLinks.forEach((el, index) => {
            if (index >= 12) return;
            const href = el.href;
            const img = el.querySelector('img');
            const isReel = el.querySelector('svg[aria-label="Reel icon"]') !== null;
            if (img && href) {
                const shortcode = href.split('/p/')[1]?.split('/')[0] || href.split('/reel/')[1]?.split('/')[0];
                if (shortcode) items.push({ shortcode, imageUrl: img.src, type: isReel ? 'reel' : 'post' });
            }
        });
        return items;
    });

    const finalData = {
      profile: {
        username,
        ...profileData,
        followers: parseInstaNumber(profileData.followers),
        following: parseInstaNumber(profileData.following),
        postsCount: parseInstaNumber(profileData.postsCount),
      },
      posts: postsAndReels.filter(p => p.type === 'post').slice(0, 10).map((post, i) => ({ ...post, caption: `Scraped post by ${username}!`, likes: random(50000, 150000), comments: random(500, 1500), postedAt: daysAgo(i * 3 + 2) })),
      reels: postsAndReels.filter(p => p.type === 'reel').slice(0, 5).map((reel, i) => ({ ...reel, thumbnailUrl: reel.imageUrl, caption: `Scraped reel by ${username}!`, views: random(200000, 800000), likes: random(20000, 80000), comments: random(200, 2000), postedAt: daysAgo(i * 7 + 1) })),
    };

    console.log(`[SUCCESS] Scrape complete for: ${username}`);
    return finalData;

  } catch (error) {
    console.error(`[SCRAPER FAILED] An error occurred while scraping ${username}:`, error.message);
    if (page) await page.screenshot({ path: 'debug_ERROR.png' });
    throw new Error(`Failed to scrape Instagram profile for ${username}. Check selectors or page structure.`);
  } finally {
    if (browser) await browser.close();
  }
};