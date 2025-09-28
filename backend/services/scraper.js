import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import Session from '../models/Session.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import { ApiError } from '../middlewares/errorHandler.js';
import logger from '../utils/logger.js';

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
  logger.debug('Navigating to Instagram login...');
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });

  logger.debug('Typing credentials...');
  await page.type('input[name="username"]', process.env.INSTAGRAM_USER, { delay: 50 });
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASS, { delay: 50 });

  logger.debug('Submitting login form...');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }),
  ]);

  try {
    const notNowButtonSelector = 'button:has-text("Not now")';
    await page.waitForSelector(notNowButtonSelector, { timeout: 10000 });
    await page.click(notNowButtonSelector);
  } catch (e) {}

  try {
    const saveInfoButton = 'button:has-text("Save Info")';
    await page.waitForSelector(saveInfoButton, { timeout: 10000 });
    await page.click(saveInfoButton);
  } catch (e) {}

  await page.waitForSelector('a[href="#"]', { timeout: 30000 });

  const cookies = await page.cookies();
  await Session.findOneAndUpdate(
    { name: 'instagram_session' },
    { cookies: JSON.stringify(cookies) },
    { upsert: true, new: true }
  );

  logger.info('Session saved successfully.');
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

    return await page.evaluate(() => !document.querySelector('input[name="username"]'));
  } catch (err) {
    logger.error('Failed to restore session:', err.message);
    return false;
  }
};

export const scrapeInstagramProfile = async (username) => {
  let browser = null;
  let page = null;

  try {
    logger.debug('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });

    if (!await restoreSession(page)) {
      logger.info('Session invalid or expired. Logging in...');
      await loginToInstagram(page);
    } else {
      logger.info('Session restored successfully.');
    }

    const url = `${process.env.INSTAGRAM_BASE_URL}/${username}/`;
    logger.debug(`Navigating to profile: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('header', { timeout: 15000 });

    const profileData = await page.evaluate(() => {
      const SELECTORS = {
        profilePic: ['header img'],
        name: ['header h2', 'header section > div > div > span'],
        bio: ['header h1', 'header section > div > span > div > span'],
        posts: [
          'header ul li:nth-child(1) > div > a > span > span',
          'header ul li:nth-child(1) button span span',
          'header ul li:nth-child(1) span',
        ],
        followers: ['header ul li:nth-child(2) a span span'],
        following: ['header ul li:nth-child(3) a span span'],
      };

      const query = (selectors, attribute = 'innerText') => {
        for (const selector of selectors) {
          try {
            const element = document.querySelector(selector);
            if (element) {
              const value = attribute === 'innerText' ? element.innerText : element.getAttribute(attribute);
              if (value) return value.trim();
            }
          } catch (err) {}
        }
        return '';
      };

      return {
        profilePicUrl: query(SELECTORS.profilePic, 'src'),
        name: query(SELECTORS.name),
        bio: query(SELECTORS.bio),
        postsCount: query(SELECTORS.posts),
        followers: query(SELECTORS.followers, 'title') || query(SELECTORS.followers),
        following: query(SELECTORS.following),
      };
    });

    if (!profileData || !profileData.profilePicUrl) {
      throw new ApiError(`Failed to scrape Instagram profile data for ${username}.`, 500);
    }

    logger.debug('Profile data extracted.');

    const pageHtml = await page.content();
    const htmlLower = pageHtml.toLowerCase();

    const isPrivate =
      /<h2[^>]*>\s*this account is private\s*<\/h2>/i.test(pageHtml) ||
      htmlLower.includes('this account is private');

    const isVerified =
      /<svg[^>]+aria-label=["']verified["']/i.test(pageHtml) ||
      /<title>\s*verified\s*<\/title>/i.test(pageHtml);

    profileData.isPrivate = Boolean(isPrivate);
    profileData.isVerified = Boolean(isVerified);

    let allItems = [];
    if (!profileData.isPrivate) {
      logger.info('Account is public. Scraping media...');
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
                if (isReel) {
                  items.push({ shortcode, thumbnailUrl: img.src, type: 'reel' });
                } else {
                  items.push({ shortcode, imageUrl: img.src, type: 'post' });
                }
              }
            }
          });
          return items;
        });

        if (itemsOnPage.length === 0) break;

        for (const item of itemsOnPage) {
          if (newMediaItems.has(item.shortcode)) continue;
          if (await Post.findOne({ shortcode: item.shortcode }) || await Reel.findOne({ shortcode: item.shortcode })) {
            logger.info(`Found cached item (${item.shortcode}). Stopping scrape.`);
            foundCachedItem = true;
            break;
          } else {
            newMediaItems.set(item.shortcode, item);
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

      allItems = Array.from(newMediaItems.values());
      logger.info(`Total new media items collected: ${allItems.length}`);
    } else {
      logger.info('Account is private. Skipping media scrape.');
    }

    return {
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
  } catch (error) {
    logger.error(`Scraper failure for ${username}:`, error.message);
    if (!(error instanceof ApiError)) {
      throw new ApiError(`Failed to scrape Instagram profile for ${username}.`, 500);
    }
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};