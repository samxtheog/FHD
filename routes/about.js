import express from 'express';
import About from '../models/About.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route - Get about details
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne().sort({ updatedAt: -1 });
    res.json(about || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', authMiddleware, async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
