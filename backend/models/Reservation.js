const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  // Basic Information
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
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  companyName: {
    type: String,
    trim: true
  },
  
  // Booking Details
  date: {
    type: Date,
    required: true
  },
  fromTime: {
    type: String,
    required: true
  },
  toTime: {
    type: String,
    required: true
  },
  tableNumber: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true,
    enum: ['first', 'second']
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Payment & Additional Details
  advanceAmount: {
    type: Number,
    default: 0
  },
  paymentMode: {
    type: String,
    enum: ['esewa', 'khalti', 'cash', 'card', 'bank', '']
  },
  refer: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Timestamps
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
reservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);