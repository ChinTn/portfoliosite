import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

export default mongoose.model('Like', likeSchema);
