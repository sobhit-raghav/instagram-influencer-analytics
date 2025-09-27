import Influencer from '../models/Influencer.js';
import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import { scrapeInstagramProfile } from '../services/scraper.js';
import { calculateEngagementMetrics } from '../utils/calculations.js';

/**
 * Handles the logic for fetching, processing, and storing an influencer's profile data.
 *
 * This function performs the following steps:
 * 1. Fetches the latest profile data using the scraper service.
 * 2. Creates or updates the influencer's profile in the database.
 * 3. Creates or updates the associated posts and reels.
 * 4. Calculates engagement metrics based on the latest posts.
 * 5. Updates the influencer's profile.
 * 6. Returns the complete, updated profile to the client.
 *
 * @param {object} req - The Express request object, containing the username in params.
 * @param {object} res - The Express response object.
 */
const getInfluencerProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const scrapedData = await scrapeInstagramProfile(username);
    const { profile, posts, reels } = scrapedData;

    const influencer = await Influencer.findOneAndUpdate(
      { username: profile.username },
      profile,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const postPromises = posts.map((postData) =>
      Post.findOneAndUpdate(
        { shortcode: postData.shortcode },
        { ...postData, influencer: influencer._id },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    );
    const savedPosts = await Promise.all(postPromises);

    const reelPromises = reels.map((reelData) =>
      Reel.findOneAndUpdate(
        { shortcode: reelData.shortcode },
        { ...reelData, influencer: influencer._id },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    );
    await Promise.all(reelPromises);

    const engagementMetrics = calculateEngagementMetrics(savedPosts, influencer.followers);

    influencer.engagement = engagementMetrics;
    const updatedInfluencer = await influencer.save();

    res.status(200).json(updatedInfluencer);
    
  } catch (error) {
    console.error('Error in getInfluencerProfile:', error);
    res.status(500).json({ message: 'Server error while fetching influencer profile.' });
  }
};

export { getInfluencerProfile };