import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';
import { ApiError } from '../middlewares/errorHandler.js';

/**
 * Retrieves the 10 most recent posts for a given influencer from the database.
 *
 * @description
 * This function is designed to be a fast, read-only endpoint. It first finds an
 * influencer by their username to get their unique ID. It then uses this ID to
 * query the Posts collection, fetching the 10 most recent entries by sorting
 * them by their `postedAt` timestamp in descending order.
 *
 * @param {object} req - The Express request object, containing the username in params.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function for error handling.
 */
const getInfluencerPosts = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new ApiError('Username is required in the request parameters.', 400);
    }

    const influencer = await Influencer.findOne({ username }).select('_id');

    if (!influencer) {
      throw new ApiError(`Influencer with username '${username}' was not found in the database.`, 404);
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