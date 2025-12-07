// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const reservationRoutes = require('./routes/reservationRoutes');
const takeawayRoutes = require('./routes/takeawayRoutes');
const quickBillRoutes = require('./routes/quickBillRoutes');
const aiRoutes = require('./routes/aiRoutes'); // ADD THIS

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/takeaways', takeawayRoutes);
app.use('/api/quickbill', quickBillRoutes);
app.use('/api/ai', aiRoutes); // ADD THIS

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});