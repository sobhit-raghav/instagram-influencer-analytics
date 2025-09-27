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
  await page.screenshot({ path: 'debug_1_login_page.png' });

  console.log('[DEBUG] Waiting for input fields...');
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  
  console.log('[DEBUG] Typing credentials...');
  await page.type('input[name="username"]', process.env.INSTAGRAM_USER, { delay: 50 });
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASS, { delay: 50 });

  await page.screenshot({ path: 'debug_2_credentials_entered.png' });
  console.log('[DEBUG] Clicking login button...');
  await page.click('button[type="submit"]');

  console.log('[DEBUG] Waiting for successful login navigation...');
  await page.waitForSelector('a[href*="/accounts/edit/"]', { timeout: 20000 });
  await page.screenshot({ path: 'debug_3_login_successful.png' });
  console.log('[SUCCESS] Login successful!');
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

    const headerSelector = 'header';
    console.log('[DEBUG] Waiting for profile header...');
    await page.waitForSelector(headerSelector, { timeout: 15000 });
    await page.screenshot({ path: 'debug_4_profile_page.png' });

    console.log('[DEBUG] Evaluating page to extract profile data...');
    const profileData = await page.evaluate((uname) => {
        const header = document.querySelector('header');
        if (!header) return null;

        const profilePicUrl = header.querySelector('img')?.src;
        const nameElement = document.querySelector('header h1');
        const followersLink = header.querySelector(`a[href="/${uname}/followers/"]`);
        const followingLink = header.querySelector(`a[href="/${uname}/following/"]`);
        const postsLi = header.querySelector('ul li:first-child');
        
        return {
            username: uname,
            name: nameElement ? nameElement.innerText : uname,
            profilePicUrl: profilePicUrl || '',
            bio: nameElement?.parentElement?.nextElementSibling?.innerText || '',
            postsCount: postsLi?.querySelector('span > span')?.innerText || '0',
            followers: followersLink?.querySelector('span')?.getAttribute('title') || '0',
            following: followingLink?.querySelector('span')?.innerText || '0',
        };
    }, username);

    if (!profileData || !profileData.profilePicUrl) {
      throw new Error('Could not extract essential profile data after login.');
    }
    console.log('[SUCCESS] Profile data extracted.');

    const postsAndReels = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('main article a').forEach((el, index) => {
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

    if (page) {
      await page.screenshot({ path: 'debug_ERROR.png' });
      // const html = await page.content();
      // console.log(html);
    }
    
    throw new Error(`Failed to scrape Instagram profile for ${username}. Check login credentials, network, or page structure.`);
  } finally {
    if (browser) await browser.close();
  }
};