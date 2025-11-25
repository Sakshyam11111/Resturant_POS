// backend/models/Takeaway.js
const mongoose = require('mongoose');

const takeawaySchema = new mongoose.Schema({
  // Order Identification
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => `TO${Date.now()}`
  },
  
  // Customer Information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  alternativeNumber: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  
  // Order Items
  items: [{
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    note: String,
    extras: [String],
    removals: [String]
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Details
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'partial'],
    default: 'unpaid'
  },
  paymentMode: {
    type: String,
    enum: ['esewa', 'khalti', 'cash', 'card', 'bank', '']
  },
  
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
takeawaySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Takeaway', takeawaySchema);