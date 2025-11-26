// backend/models/QuickBill.js
const mongoose = require('mongoose');

const quickBillSchema = new mongoose.Schema({
  // Order Identification
  orderId: {
    type: String,
    required: true,
    default: () => `QB${Date.now()}`
  },
  
  // Dine-in Items
  dineInOrderItems: [{
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    note: String,
    extras: [String],
    removals: [String]
  }],
  
  // Takeaway Items
  takeawayOrderItems: [{
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    note: String,
    extras: [String],
    removals: [String]
  }],
  
  // Discounts
  dineInDiscount: {
    type: Number,
    default: 0
  },
  
  takeawayDiscount: {
    type: Number,
    default: 0
  },
  
  // Calculated Values
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  
  tax: {
    type: Number,
    default: 0
  },
  
  totalDiscount: {
    type: Number,
    default: 0
  },
  
  total: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['esewa', 'khalti', 'cash', 'card', 'bank', ''],
    default: 'cash'
  },
  
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'partial'],
    default: 'paid'
  },
  
  // Timestamps
  billDate: {
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
quickBillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('QuickBill', quickBillSchema);