import Influencer from '../models/Influencer.js';
import Reel from '../models/Reel.js';

/**
 * Retrieves the 5 most recent reels for a given influencer from the database.
 *
 * @description
 * This is a fast, read-only endpoint that works in two steps. First, it finds an
 * influencer by their username to retrieve their unique database ID. Second, it
 * uses that ID to query the Reels collection for the 5 most recent documents,
 * sorted by their `postedAt` timestamp in descending order.
 *
 * @param {object} req - The Express request object, containing the username in params.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function for error handling.
 */
const getInfluencerReels = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      res.status(400);
      return next(new Error('Username is required in the request parameters.'));
    }

    const influencer = await Influencer.findOne({ username }).select('_id');

    if (!influencer) {
      res.status(404);
      return next(new Error(`Influencer with username '${username}' was not found in the database.`));
    }

    const reels = await Reel.find({ influencer: influencer._id })
      .sort({ postedAt: -1 })
      .limit(5);

    res.status(200).json(reels);

  } catch (error) {
    console.error(`[Controller Error] Failed to fetch reels for ${req.params.username}:`, error.message);
    next(error);
  }
};

export { getInfluencerReels };