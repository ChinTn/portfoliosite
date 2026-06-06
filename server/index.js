import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import 'dotenv/config';

// Force IPv4 because Render's free tier has broken outbound IPv6 routing
dns.setDefaultResultOrder('ipv4first');

import Project from './models/Project.js';
import Blog from './models/Blog.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowed = [
      /^http:\/\/localhost:\d+$/,
      /\.vercel\.app$/,
      /\.dev$/,
      'https://whosworld.vercel.app/'
    ];
    
    const isAllowed = allowed.some(pattern => 
      typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
    );
    
    if (isAllowed) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Keep-alive health endpoint (ping this every 14 min via cron-job.org)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Routes
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import blogsRoutes from './routes/blogs.js';
import contactRoutes from './routes/contact.js';
import spotifyRoutes from './routes/spotify.js';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/spotify', spotifyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
