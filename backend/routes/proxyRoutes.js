import express from 'express';
import { imageProxy } from '../controllers/proxyController.js';

const router = express.Router();

/**
 * @route   GET /api/proxy
 * @desc    Proxy endpoint to fetch images from external URLs.
 * @access  Public
 */
router.route('/').get(imageProxy);

export default router;