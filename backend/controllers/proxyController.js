import axios from 'axios';
import { ApiError } from '../middlewares/errorHandler.js';

/** * Proxies an image request to fetch the image from an external URL.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function for error handling.
 */
const imageProxy = async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      throw new ApiError('Image URL is required', 400);
    }

    const response = await axios({
      method: 'get',
      url: decodeURIComponent(url),
      responseType: 'stream',
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
    
  } catch (error) {
    next(new ApiError('Failed to fetch image from proxy.', 500));
  }
};

export { imageProxy };