import express from 'express';
import VipLevel from '../models/VipLevel.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all VIP levels
router.get('/', async (req, res) => {
  try {
    const vipLevels = await VipLevel.find().sort({ createdAt: 1 });
    res.json(vipLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create VIP level (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const vipLevel = new VipLevel(req.body);
    const savedVipLevel = await vipLevel.save();
    res.status(201).json(savedVipLevel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update VIP level (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedVipLevel = await VipLevel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedVipLevel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete VIP level (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await VipLevel.findByIdAndDelete(req.params.id);
    res.json({ message: 'VIP level deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
