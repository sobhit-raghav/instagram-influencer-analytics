import express from 'express';
import { getInfluencerReels } from '../controllers/reelController.js';

const router = express.Router();

/**
 * @route   GET /api/reels/:username
 * @desc    Fetch the 5 most recent reels for a given influencer from the database.
 * @access  Public
 */
router.route('/:username').get(getInfluencerReels);

export default router;