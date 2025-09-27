import Influencer from '../models/Influencer.js';
import Reel from '../models/Reel.js';

/**
 * Retrieves the 5 most recent reels for a given influencer.
 *
 * This function finds an influencer by their username, then uses their
 * database ID to fetch their most recent reels, sorted in descending
 * order by the 'postedAt' date.
 *
 * @param {object} req - The Express request object, containing the username in params.
 * @param {object} res - The Express response object.
 */
const getInfluencerReels = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const influencer = await Influencer.findOne({ username }).select('_id');

    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }

    const reels = await Reel.find({ influencer: influencer._id })
      .sort({ postedAt: -1 })
      .limit(5);

    res.status(200).json(reels);

  } catch (error) {
    console.error('Error in getInfluencerReels:', error);
    res.status(500).json({ message: 'Server error while fetching reels.' });
  }
};

export { getInfluencerReels };