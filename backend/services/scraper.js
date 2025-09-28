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

const loginToInstagram = async (page) => {
  console.log('[LOGIN] Navigating to Instagram login...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' });
  console.log('[LOGIN] Page loaded, waiting for username input...');

  await page.waitForSelector('input[name="username"]', { timeout: 30000 });
  console.log('[LOGIN] Typing credentials...');
  await page.type('input[name="username"]', process.env.INSTAGRAM_USER, { delay: 50 });
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASS, { delay: 50 });

  console.log('[LOGIN] Submitting login form...');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }),
  ]);

  try {
    const notNowButtonSelector = 'button:has-text("Not now")';
    console.log('[LOGIN] Checking for "Not now" popup...');
    await page.waitForSelector(notNowButtonSelector, { timeout: 10000 });
    await page.click(notNowButtonSelector);
    console.log('[LOGIN] Clicked "Not now".');
  } catch (e) {
    console.log('[LOGIN] No "Not now" popup found.');
  }

  try {
    const saveInfoButton = 'button:has-text("Save Info")';
    console.log('[LOGIN] Checking for "Save Info" popup...');
    await page.waitForSelector(saveInfoButton, { timeout: 10000 });
    await page.click(saveInfoButton);
    console.log('[LOGIN] Clicked "Save Info".');
  } catch (e) {
    console.log('[LOGIN] No "Save Info" popup found.');
  }

  await page.waitForSelector('a[href="#"]', { timeout: 30000 });

  const cookies = await page.cookies();
  await Session.findOneAndUpdate(
    { name: 'instagram_session' },
    { cookies: JSON.stringify(cookies) },
    { upsert: true, new: true }
  );
  console.log('[LOGIN] Session saved successfully.');
};

const restoreSession = async (page) => {
  const savedSession = await Session.findOne({ name: 'instagram_session' });
  if (!savedSession || !savedSession.cookies) return false;

  try {
    const cookies = JSON.parse(savedSession.cookies);
    const sanitizedCookies = cookies.map(cookie => {
      if (!cookie.url) cookie.url = `https://${cookie.domain.replace(/^\./, '')}`;
      return cookie;
    });

    await page.setCookie(...sanitizedCookies);
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

    const loggedIn = await page.evaluate(() => {
      return !document.querySelector('input[name="username"]');
    });
    return loggedIn;
  } catch (err) {
    console.log('[SESSION] Failed to restore session:', err.message);
    return false;
  }
};

export const scrapeInstagramProfile = async (username) => {
  let browser = null;
  let page = null;

  try {
    console.log(`[SCRAPER] Launching browser...`);
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    page = await browser.newPage();
    console.log(`[SCRAPER] Setting headers...`);
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    });

    let sessionIsValid = await restoreSession(page);
    if (!sessionIsValid) {
      console.log('[SCRAPER] Session invalid or expired. Logging in...');
      await loginToInstagram(page);
    } else {
      console.log('[SCRAPER] Session restored successfully.');
    }

    const url = `${process.env.INSTAGRAM_BASE_URL}/${username}/`;
    console.log(`[SCRAPER] Navigating to profile: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('[SCRAPER] Waiting for profile header...');
    await page.waitForSelector('header', { timeout: 15000 });

    console.log('[SCRAPER] Extracting profile data...');
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

    console.log('[SCRAPER] Profile data extracted:', profileData);

    if (!profileData || !profileData.profilePicUrl) {
      throw new ApiError(`Failed to scrape Instagram profile for ${username}. Check selectors or page structure.`, 500);
    }

    console.log('[SCRAPER] Starting media scrape (posts & reels)...');
    const newMediaItems = new Map();
    let scrollCount = 0;
    const maxScrolls = 15;
    let foundCachedItem = false;

    await page.waitForSelector('main a[href*="/p/"] img', { timeout: 15000 });

    while (scrollCount < maxScrolls) {
      console.log(`[SCRAPER] Scrolling... (${scrollCount + 1}/${maxScrolls})`);
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

      console.log(`[SCRAPER] Found ${itemsOnPage.length} items on page.`);

      if (itemsOnPage.length === 0) break;

      for (const item of itemsOnPage) {
        if (newMediaItems.has(item.shortcode)) continue;

        const existingPost = await Post.findOne({ shortcode: item.shortcode }).select('_id');
        const existingReel = await Reel.findOne({ shortcode: item.shortcode }).select('_id');

        if (existingPost || existingReel) {
          console.log(`[SCRAPER] Found cached item (${item.shortcode}) Stopping scrape.`);
          foundCachedItem = true;
          break;
        } else {
          newMediaItems.set(item.shortcode, item);
          console.log(`[SCRAPER] New item added: ${item.shortcode} (${item.type})`);
        }

        const postsCount = Array.from(newMediaItems.values()).filter(i => i.type === 'post').length;
        const reelsCount = Array.from(newMediaItems.values()).filter(i => i.type === 'reel').length;
        if (postsCount >= 10 && reelsCount >= 5) {
          console.log('[SCRAPER] Required number of posts and reels collected. Stopping scrape.');
          break;
        }
      }
      if (foundCachedItem) break;

      const postsCount = Array.from(newMediaItems.values()).filter(i => i.type === 'post').length;
      const reelsCount = Array.from(newMediaItems.values()).filter(i => i.type === 'reel').length;
      if (postsCount >= 10 && reelsCount >= 5) break;

      await page.evaluate('window.scrollBy(0, window.innerHeight)');
      await new Promise(resolve => setTimeout(resolve, 2000));
      scrollCount++;
    }


    const allItems = Array.from(newMediaItems.values());
    console.log(`[SCRAPER] Total new media items collected: ${allItems.length}`);

    const finalData = {
      profile: {
        username,
        ...profileData,
        followers: parseInstaNumber(profileData.followers),
        following: parseInstaNumber(profileData.following),
        postsCount: parseInstaNumber(profileData.postsCount),
      },
      posts: allItems.filter(p => p.type === 'post').slice(0, 10),
      reels: allItems.filter(p => p.type === 'reel').slice(0, 5),
    };

    console.log('[SCRAPER] Final data prepared:', JSON.stringify(finalData.profile, null, 2));
    console.log(`[SCRAPER] Returning ${finalData.posts.length} posts and ${finalData.reels.length} reels.`);

    return finalData;

  } catch (error) {
    console.error(`[SCRAPER ERROR] ${username}:`, error.message);
    // if (page) await page.screenshot({ path: 'debug_ERROR.png' });
    if (!(error instanceof ApiError)) {
      throw new ApiError(`Failed to scrape Instagram profile for ${username}. Check selectors or page structure.`, 500);
    }
    throw error;
  } finally {
    if (browser) {
      console.log('[SCRAPER] Closing browser...');
      await browser.close();
    }
  }
};