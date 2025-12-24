// ============================================================================
// SKILLBUDDY BACKEND - Entry Point
// ============================================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const profileRoutes = require('./routes/profile'); // ✅ NEW

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Middleware
// ============================================================================
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// ============================================================================
// Static Files (Profile Images)
// ============================================================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================================
// Database Connection
// ============================================================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbuddy')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============================================================================
// Routes
// ============================================================================
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);        // ✅ PROFILE API
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/doubts', require('./routes/doubtRoutes'));
app.use('/api/gamification', require('./routes/gamificationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes')); // ✅ NOTIFICATIONS API
app.use('/api/search', require('./routes/searchRoutes')); // ✅ SEARCH API

// ============================================================================
// Health Check
// ============================================================================
app.get('/', (req, res) => {
  res.send('SkillBuddy API is Running 🚀');
});

// ============================================================================
// Start Server
// ============================================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
