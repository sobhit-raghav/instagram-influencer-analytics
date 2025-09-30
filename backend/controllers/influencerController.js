import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import { scrapeInstagramProfile } from '../services/scraper.js';
import { analyzeImage, analyzeVideo } from '../services/analysisService.js';
import { ApiError } from '../middlewares/errorHandler.js';
import logger from '../utils/logger.js';

const getFullProfileResponse = async (influencerId) => {
  const [influencer, posts, reels] = await Promise.all([
    Influencer.findById(influencerId),
    Post.find({ influencer: influencerId }).sort({ postedAt: -1 }).limit(5),
    Reel.find({ influencer: influencerId }).sort({ postedAt: -1 }).limit(5),
  ]);

  return { influencer, posts, reels };
};

const getInfluencerProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      return next(new ApiError('Username is required in the request parameters.', 400));
    }

    const scrapedData = await scrapeInstagramProfile(username);
    if (!scrapedData) {
      return next(new ApiError(`Profile for '${username}' not found or could not be scraped.`, 404));
    }

    const postShortcodes = scrapedData.posts.map(p => p.shortcode);
    const reelShortcodes = scrapedData.reels.map(r => r.shortcode);

    const [existingPosts, existingReels] = await Promise.all([
      Post.find({ shortcode: { $in: postShortcodes } }),
      Reel.find({ shortcode: { $in: reelShortcodes } }),
    ]);

    const existingPostsMap = new Map(existingPosts.map(p => [p.shortcode, p]));
    const existingReelsMap = new Map(existingReels.map(r => [r.shortcode, r]));

    const postsWithAnalysis = await Promise.all(
      scrapedData.posts.map(async (post) => {
        const existing = existingPostsMap.get(post.shortcode);
        if (existing?.analysis?.vibe && existing.analysis.vibe !== 'N/A') {
          return { ...post, analysis: existing.analysis };
        }
        const analysisData = await analyzeImage(post.imageUrl);
        return { ...post, analysis: analysisData };
      })
    );

    const reelsWithAnalysis = await Promise.all(
      scrapedData.reels.map(async (reel) => {
        const existing = existingReelsMap.get(reel.shortcode);
        if (existing?.analysis?.vibe && existing.analysis.vibe !== 'N/A') {
          return { ...reel, analysis: existing.analysis };
        }
        const analysisData = await analyzeVideo(reel.thumbnailUrl);
        return { ...reel, analysis: analysisData };
      })
    );
    
    const influencer = await Influencer.findOneAndUpdate(
      { username: scrapedData.profile.username },
      scrapedData.profile,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (postsWithAnalysis.length > 0) {
      const postOps = postsWithAnalysis.map(postData => ({
        updateOne: {
          filter: { shortcode: postData.shortcode },
          update: { $set: { ...postData, influencer: influencer._id } },
          upsert: true,
        },
      }));
      await Post.bulkWrite(postOps);
    }

    if (reelsWithAnalysis.length > 0) {
      const reelOps = reelsWithAnalysis.map(reelData => ({
        updateOne: {
          filter: { shortcode: reelData.shortcode },
          update: { $set: { ...reelData, influencer: influencer._id } },
          upsert: true,
        },
      }));
      await Reel.bulkWrite(reelOps);
    }
    
    logger.info(`Successfully stored data for "${username}"`);
    const finalProfile = await getFullProfileResponse(influencer._id);
    
    res.status(200).json({
      success: true,
      data: finalProfile,
    });
  } catch (error) {
    logger.error(`[Controller Error] for ${req.params.username || "unknown"}: ${error.message}`);
    next(error instanceof ApiError ? error : new ApiError(error.message, 500));
  }
};

export { getInfluencerProfile };