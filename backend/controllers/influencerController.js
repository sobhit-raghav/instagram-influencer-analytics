import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import { scrapeInstagramProfile } from '../services/scraper.js';
import { calculateEngagementMetrics } from '../utils/calculations.js';
import { analyzeImage } from '../services/imageProcessing.js';
import { analyzeVideo } from '../services/videoProcessing.js';
import ApiError from '../utils/ApiError.js';

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
      throw new ApiError('Username is required in the request parameters.', 400);
    }

    const scrapedData = await scrapeInstagramProfile(username);

    if (!scrapedData) {
      throw new ApiError(`Profile for '${username}' not found, is private, or could not be scraped.`, 404);
    }

    const { profile, posts, reels } = scrapedData;

    const influencer = await Influencer.findOneAndUpdate(
      { username: profile.username },
      profile,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const postPromises = posts.map(async (postData) => {
      const analysisResults = await analyzeImage(postData.caption);
      const enrichedPostData = {
        ...postData,
        influencer: influencer._id,
        ...analysisResults,
      };
      return Post.findOneAndUpdate(
        { shortcode: postData.shortcode },
        enrichedPostData,
        { new: true, upsert: true }
      );
    });
    const savedPosts = await Promise.all(postPromises);

    const reelPromises = reels.map(async (reelData) => {
      const analysisResults = await analyzeVideo(reelData.caption);
      const enrichedReelData = {
        ...reelData,
        influencer: influencer._id,
        ...analysisResults,
      };
      return Reel.findOneAndUpdate(
        { shortcode: reelData.shortcode },
        enrichedReelData,
        { new: true, upsert: true }
      );
    });
    await Promise.all(reelPromises);

    const engagementMetrics = calculateEngagementMetrics(savedPosts, influencer.followers);

    influencer.engagement = engagementMetrics;
    const updatedInfluencer = await influencer.save();

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