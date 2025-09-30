import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';
import { ApiError } from '../middlewares/errorHandler.js';

const getInfluencerPosts = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      return next(new ApiError('Username is required in the request parameters.', 400));
    }

    const influencer = await Influencer.findOne({ username }).select('_id');

    if (!influencer) {
      return next(new ApiError(`Influencer with username '${username}' was not found in the database.`, 404));
    }

    const posts = await Post.find({ influencer: influencer._id })
      .sort({ postedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error(`[Controller Error] Failed to fetch posts for ${req.params.username || "unknown"}:`, error.message);
    next(error instanceof ApiError ? error : new ApiError(error.message, 500));
  }
};

export { getInfluencerPosts };