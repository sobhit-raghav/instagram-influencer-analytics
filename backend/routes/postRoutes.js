import express from 'express';
import { getInfluencerPosts } from '../controllers/postController.js';

const router = express.Router();

/**
 * @route   GET /api/posts/:username
 * @desc    Fetch the 10 most recent posts for a given influencer from the database.
 * @access  Public
 */
router.route('/:username').get(getInfluencerPosts);

export default router;