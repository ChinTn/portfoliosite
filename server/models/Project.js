import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  deployedLink: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
    enum: ['current', 'completed', 'future'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Project', projectSchema);
