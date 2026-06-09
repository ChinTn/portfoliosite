import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './server/models/Project.js';

dotenv.config({ path: './server/.env' });

const migrate = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(mongoURI);
    console.log('Connected to DB');

    const result = await Project.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'completed' } }
    );
    
    console.log(`Updated ${result.modifiedCount} projects to have status='completed'`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
