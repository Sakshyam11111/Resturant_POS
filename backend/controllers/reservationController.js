const Reservation = require('../models/Reservation');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating reservation',
      error: error.message
    });
  }
};

// Get all reservations with filters
exports.getAllReservations = async (req, res) => {
  try {
    const { status, date, floor } = req.query;
    
    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (date) filter.date = new Date(date);
    if (floor) filter.floor = floor;
    
    const reservations = await Reservation.find(filter).sort({ date: -1, fromTime: -1 });
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
};

// Get a single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservation',
      error: error.message
    });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating reservation',
      error: error.message
    });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting reservation',
      error: error.message
    });
  }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation status updated successfully',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating reservation status',
      error: error.message
    });
  }
};