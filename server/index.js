const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 because Render's free tier has broken outbound IPv6 routing
dns.setDefaultResultOrder('ipv4first');

const Project = require('./models/Project');
const Blog = require('./models/Blog');

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

// TEMPORARY DEBUG ROUTE - remove after fixing
app.get('/test-email', async (req, res) => {
  const nodemailer = require('nodemailer');
  
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
  console.log('EMAIL_PASS has spaces:', process.env.EMAIL_PASS?.includes(' '));

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    res.json({ status: 'transporter OK', user: process.env.EMAIL_USER });
  } catch (err) {
    res.status(500).json({ 
      status: 'transporter FAILED', 
      error: err.message,
      code: err.code 
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/contact', require('./routes/contact'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
