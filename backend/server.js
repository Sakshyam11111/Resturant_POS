// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_pos';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// QuickBill Schema
const quickBillSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  dineInOrderItems: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    note: String,
    extras: [String],
    removals: [String],
  }],
  takeawayOrderItems: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    note: String,
    extras: [String],
    removals: [String],
  }],
  dineInDiscount: {
    type: Number,
    default: 0,
  },
  takeawayDiscount: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuickBill = mongoose.model('QuickBill', quickBillSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// POST endpoint to save QuickBill
app.post('/api/quickbill', async (req, res) => {
  try {
    const {
      orderId,
      dineInOrderItems,
      takeawayOrderItems,
      dineInDiscount,
      takeawayDiscount,
    } = req.body;

    // Calculate totals
    const subtotal =
      dineInOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      takeawayOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const discount = dineInDiscount + takeawayDiscount;
    const tax = subtotal * 0.13;
    const total = subtotal + tax - discount;

    // Create new QuickBill
    const quickBill = new QuickBill({
      orderId,
      dineInOrderItems,
      takeawayOrderItems,
      dineInDiscount,
      takeawayDiscount,
      subtotal,
      tax,
      discount,
      total,
    });

    await quickBill.save();

    res.status(201).json({
      success: true,
      message: 'QuickBill saved successfully',
      data: quickBill,
    });
  } catch (error) {
    console.error('Error saving QuickBill:', error);
    
    // Handle duplicate orderId error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order ID already exists',
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save QuickBill',
      error: error.message,
    });
  }
});

// GET endpoint to retrieve all QuickBills
app.get('/api/quickbills', async (req, res) => {
  try {
    const quickBills = await QuickBill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: quickBills.length,
      data: quickBills,
    });
  } catch (error) {
    console.error('Error fetching QuickBills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch QuickBills',
      error: error.message,
    });
  }
});

// GET endpoint to retrieve a single QuickBill by orderId
app.get('/api/quickbill/:orderId', async (req, res) => {
  try {
    const quickBill = await QuickBill.findOne({ orderId: req.params.orderId });
    
    if (!quickBill) {
      return res.status(404).json({
        success: false,
        message: 'QuickBill not found',
      });
    }

    res.status(200).json({
      success: true,
      data: quickBill,
    });
  } catch (error) {
    console.error('Error fetching QuickBill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch QuickBill',
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});