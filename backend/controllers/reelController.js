import Influencer from '../models/Influencer.js';
import Reel from '../models/Reel.js';
import { ApiError } from '../middlewares/errorHandler.js';

const getInfluencerReels = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      return next(new ApiError('Username is required in the request parameters.', 400));
    }

    const influencer = await Influencer.findOne({ username }).select('_id');

    if (!influencer) {
      return next(new ApiError(`Influencer with username '${username}' was not found in the database.`, 404));
    }

    const reels = await Reel.find({ influencer: influencer._id })
      .sort({ postedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: reels.length,
      data: reels,
    });

  } catch (error) {
    console.error(`[Controller Error] Failed to fetch reels for ${req.params.username}:`, error.message);
    next(error instanceof ApiError ? error : new ApiError(error.message, 500));
  }
};

export { getInfluencerReels };