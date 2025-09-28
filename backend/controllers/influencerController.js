import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import { scrapeInstagramProfile } from '../services/scraper.js';
import { ApiError } from '../middlewares/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Orchestrates fetching, processing, and storing an influencer's profile.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function for error handling.
 */
const getInfluencerProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      return next(new ApiError('Username is required in the request parameters.', 400));
    }

    const CACHE_DURATION_MS = 10 * 60 * 1000;

    const existingInfluencer = await Influencer.findOne({ username });

    if (existingInfluencer) {
      const lastUpdated = new Date(existingInfluencer.updatedAt).getTime();
      const isCacheFresh = (new Date().getTime() - lastUpdated) < CACHE_DURATION_MS;

      if (isCacheFresh) {
        logger.info(`Cache hit for "${username}". Returning data from DB.`);
        return res.status(200).json({
          success: true,
          data: existingInfluencer,
          source: 'cache'
        });
      }
    }

    logger.info(`Cache miss or stale for "${username}". Starting scrape.`);
    const scrapedData = await scrapeInstagramProfile(username);
    if (!scrapedData) {
      return next(new ApiError(`Profile for '${username}' not found or could not be scraped.`, 404));
    }

    const { profile, posts, reels } = scrapedData;

    const influencer = await Influencer.findOneAndUpdate(
      { username: profile.username },
      profile,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (posts.length > 0) {
      const postOps = posts.map(postData => ({
        updateOne: {
          filter: { shortcode: postData.shortcode },
          update: { $set: { ...postData, influencer: influencer._id } },
          upsert: true
        }
      }));
      await Post.bulkWrite(postOps);
    }

    if (reels.length > 0) {
      const reelOps = reels.map(reelData => ({
        updateOne: {
          filter: { shortcode: reelData.shortcode },
          update: { $set: { ...reelData, influencer: influencer._id } },
          upsert: true
        }
      }));
      await Reel.bulkWrite(reelOps);
    }

    const updatedInfluencer = await Influencer.findById(influencer._id);

    res.status(200).json({
      success: true,
      data: updatedInfluencer,
    });
  } catch (error) {
    console.error(`[Controller Error] ${req.params.username || "unknown"}: ${error.message}`);
    next(error instanceof ApiError ? error : new ApiError(error.message, 500));
  }
};

export { getInfluencerProfile };