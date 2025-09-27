import Influencer from '../models/Influencer.js';
import scraper from '../services/scraper.js';

/**
 * @desc    Get influencer profile by username
 * @route   GET /api/influencer/:username
 * @access  Public
 */
export const getInfluencerProfile = async (req, res) => {
  try {
    const { username } = req.params;

    let influencer = await Influencer.findOne({ username });

    if (!influencer) {
      const scrapedData = await scraper.fetchInfluencer(username);

      influencer = await Influencer.create(scrapedData);
    }

    res.status(200).json(influencer);
  } catch (error) {
    console.error(`Error in getInfluencerProfile: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create or update influencer profile manually
 * @route   POST /api/influencer
 * @access  Public
 */
export const createOrUpdateInfluencer = async (req, res) => {
  try {
    const { name, username, profilePic, followers, following, postsCount } = req.body;

    let influencer = await Influencer.findOne({ username });

    if (influencer) {
      influencer.name = name || influencer.name;
      influencer.profilePic = profilePic || influencer.profilePic;
      influencer.followers = followers || influencer.followers;
      influencer.following = following || influencer.following;
      influencer.postsCount = postsCount || influencer.postsCount;

      await influencer.save();
    } else {
      influencer = await Influencer.create({
        name,
        username,
        profilePic,
        followers,
        following,
        postsCount,
      });
    }

    res.status(200).json(influencer);
  } catch (error) {
    console.error(`Error in createOrUpdateInfluencer: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};