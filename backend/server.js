import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import influencerRoutes from './routes/influencerRoutes.js';
import proxyRoutes from './routes/proxyRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

app.use('/api/influencer', influencerRoutes);
app.use('/api/proxy', proxyRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});