import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  communityName: { type: String, required: true, default: 'FainterHD' },
  disclaimer: { type: String },
  socialLinks: {
    discord: { type: String },
    twitter: { type: String },
    youtube: { type: String },
    twitch: { type: String },
    instagram: { type: String },
    tiktok: { type: String }
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Settings', settingsSchema);
