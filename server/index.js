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
      if (!origin || origin.startsWith('http://localhost:') || origin.endsWith('.vercel.app') || origin.endsWith('.dev')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, 
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/contact', require('./routes/contact'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
