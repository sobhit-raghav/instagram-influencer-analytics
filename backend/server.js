import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import influencerRoutes from './routes/influencerRoutes.js';
import postRoutes from './routes/postRoutes.js';
import reelRoutes from './routes/reelRoutes.js';
import proxyRoutes from './routes/proxyRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://instagram-influencer-analytics-frontend.onrender.com'];
app.use(
  cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

app.use('/api/influencer', influencerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/proxy', proxyRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});