import express from 'express';
import Like from '../models/Like.js';

const router = express.Router();

// GET total likes and check if specific user liked
router.get('/', async (req, res) => {
  try {
    const { clerkUserId } = req.query;
    const totalLikes = await Like.countDocuments();
    
    let hasLiked = false;
    if (clerkUserId) {
      const userLike = await Like.findOne({ clerkUserId });
      if (userLike) hasLiked = true;
    }

    res.json({ total: totalLikes, hasLiked });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a like (toggle)
router.post('/', async (req, res) => {
  try {
    const { clerkUserId } = req.body;
    if (!clerkUserId) return res.status(400).json({ message: "User ID required" });

    const existingLike = await Like.findOne({ clerkUserId });
    
    if (existingLike) {
      // User requested "if I liked once it is done", meaning we don't necessarily want to allow unliking,
      // but typically toggle buttons allow unliking. We'll allow unlike if they click it again.
      // If we strictly don't want unlike, we can just return success here.
      // Let's implement strict "once liked, it's done" behavior:
      return res.json({ message: "Already liked", total: await Like.countDocuments() });
    } else {
      const newLike = new Like({ clerkUserId });
      await newLike.save();
    }

    const totalLikes = await Like.countDocuments();
    res.status(201).json({ success: true, total: totalLikes });
  } catch (error) {
    console.error("Error saving like:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
