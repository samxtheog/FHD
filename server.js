import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';
import aboutRoutes from './routes/about.js';
import rewardsRoutes from './routes/rewards.js';
import rewardRulesRoutes from './routes/rewardRules.js';
import settingsRoutes from './routes/settings.js';
import leaderboardRoutes from './routes/leaderboard.js';
import vipLevelsRoutes from './routes/vipLevels.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/reward-rules', rewardRulesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/vip-levels', vipLevelsRoutes);

// Initialize admin user
const initAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashedPassword });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Self-ping every 5 minutes to keep Render free tier alive
const selfPing = () => {
  const url = process.env.RENDER_EXTERNAL_URL;
  if (!url) return;
  setInterval(async () => {
    try {
      const { default: https } = await import('https');
      https.get(url, (res) => console.log(`Self-ping: ${res.statusCode}`))
           .on('error', (err) => console.error('Self-ping error:', err.message));
    } catch (e) {
      console.error('Self-ping failed:', e.message);
    }
  }, 5 * 60 * 1000);
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    initAdmin();
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      selfPing();
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
