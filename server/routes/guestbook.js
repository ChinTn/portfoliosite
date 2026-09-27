import express from 'express';
import Guestbook from '../models/Guestbook.js';

const router = express.Router();

// GET all guestbook entries (sorted newest first)
router.get('/', async (req, res) => {
  try {
    const entries = await Guestbook.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching guestbook:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new guestbook entry
router.post('/', async (req, res) => {
  try {
    const { clerkUserId, name, imageUrl, message } = req.body;

    if (!clerkUserId || !name || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEntry = new Guestbook({
      clerkUserId,
      name,
      imageUrl,
      message
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error("Error saving guestbook entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE an entry (Optional, for you as admin)
router.delete('/:id', async (req, res) => {
  try {
    // In a real app, you'd verify if the user deleting is the owner or an admin
    await Guestbook.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
