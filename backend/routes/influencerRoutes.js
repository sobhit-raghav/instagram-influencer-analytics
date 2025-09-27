import express from 'express';
import { getInfluencerProfile } from '../controllers/influencerController.js';

const router = express.Router();

/**
 * @route   GET /api/influencer/:username
 * @desc    Fetch and return the full profile for a given influencer.
 * This is the main endpoint that triggers the scraping, data processing,
 * and database updates.
 * @access  Public
 */
router.route('/:username').get(getInfluencerProfile);

export default router;