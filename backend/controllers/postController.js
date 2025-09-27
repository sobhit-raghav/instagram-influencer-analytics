import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';

/**
 * Retrieves the 10 most recent posts for a given influencer.
 *
 * This function finds an influencer by their username, then uses their
 * database ID to fetch their most recent posts, sorted in descending
 * order by the 'postedAt' date.
 *
 * @param {object} req - The Express request object, containing the username in params.
 * @param {object} res - The Express response object.
 */
const getInfluencerPosts = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const influencer = await Influencer.findOne({ username }).select('_id');

    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }

    const posts = await Post.find({ influencer: influencer._id })
      .sort({ postedAt: -1 })
      .limit(10);

    res.status(200).json(posts);

  } catch (error) {
    console.error('Error in getInfluencerPosts:', error);
    res.status(500).json({ message: 'Server error while fetching posts.' });
  }
};

export { getInfluencerPosts };