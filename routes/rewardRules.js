import express from 'express';
import RewardRule from '../models/RewardRule.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route - Get all active rules
router.get('/', async (req, res) => {
  try {
    const rules = await RewardRule.find({ isActive: true }).sort({ order: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const rules = await RewardRule.find().sort({ order: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const rule = new RewardRule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const rule = await RewardRule.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(rule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await RewardRule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
