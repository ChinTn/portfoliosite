import express from 'express';
const router = express.Router();
import Settings from '../models/Settings.js';
import auth from '../middleware/auth.js';

// Get Settings (Public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if none exists
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Settings (Admin Only)
router.put('/', auth, async (req, res) => {
  try {
    const { location, temperature } = req.body;
    let settings = await Settings.findOne();
    
    if (settings) {
      settings.location = location !== undefined ? location : settings.location;
      settings.temperature = temperature !== undefined ? temperature : settings.temperature;
      settings.updatedAt = Date.now();
      await settings.save();
    } else {
      settings = await Settings.create({ location, temperature });
    }
    
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
