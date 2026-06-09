import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  location: {
    type: String,
    default: 'Unknown Location',
  },
  temperature: {
    type: String,
    default: '--°C',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Settings', settingsSchema);
