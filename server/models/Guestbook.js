import mongoose from 'mongoose';

const guestbookSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
}, { timestamps: true });

export default mongoose.model('Guestbook', guestbookSchema);
