// backend/controllers/takeawayController.js
const Takeaway = require('../models/Takeaway');

// Create a new takeaway order
exports.createTakeaway = async (req, res) => {
  try {
    const takeaway = new Takeaway(req.body);
    await takeaway.save();
    
    res.status(201).json({
      success: true,
      message: 'Takeaway order created successfully',
      data: takeaway
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating takeaway order',
      error: error.message
    });
  }
};

// Get all takeaway orders with filters
exports.getAllTakeaways = async (req, res) => {
  try {
    const { status, paymentStatus, date, phoneNumber } = req.query;
    
    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.orderDate = { $gte: startDate, $lte: endDate };
    }
    if (phoneNumber) filter.phoneNumber = phoneNumber;
    
    const takeaways = await Takeaway.find(filter).sort({ orderDate: -1 });
    
    res.json({
      success: true,
      count: takeaways.length,
      data: takeaways
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching takeaway orders',
      error: error.message
    });
  }
};

// Get a single takeaway order by ID
exports.getTakeawayById = async (req, res) => {
  try {
    const takeaway = await Takeaway.findById(req.params.id);
    
    if (!takeaway) {
      return res.status(404).json({
        success: false,
        message: 'Takeaway order not found'
      });
    }
    
    res.json({
      success: true,
      data: takeaway
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching takeaway order',
      error: error.message
    });
  }
};

// Get takeaway order by order ID
exports.getTakeawayByOrderId = async (req, res) => {
  try {
    const takeaway = await Takeaway.findOne({ orderId: req.params.orderId });
    
    if (!takeaway) {
      return res.status(404).json({
        success: false,
        message: 'Takeaway order not found'
      });
    }
    
    res.json({
      success: true,
      data: takeaway
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching takeaway order',
      error: error.message
    });
  }
};

// Update a takeaway order
exports.updateTakeaway = async (req, res) => {
  try {
    const takeaway = await Takeaway.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!takeaway) {
      return res.status(404).json({
        success: false,
        message: 'Takeaway order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Takeaway order updated successfully',
      data: takeaway
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating takeaway order',
      error: error.message
    });
  }
};

// Delete a takeaway order
exports.deleteTakeaway = async (req, res) => {
  try {
    const takeaway = await Takeaway.findByIdAndDelete(req.params.id);
    
    if (!takeaway) {
      return res.status(404).json({
        success: false,
        message: 'Takeaway order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Takeaway order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting takeaway order',
      error: error.message
    });
  }
};

// Update takeaway status
exports.updateTakeawayStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const takeaway = await Takeaway.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!takeaway) {
      return res.status(404).json({
        success: false,
        message: 'Takeaway order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Takeaway status updated successfully',
      data: takeaway
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating takeaway status',
      error: error.message
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMode } = req.body;
    
    if (!['paid', 'unpaid', 'partial'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status value'
      });
    }
    
    const updateData = { paymentStatus, updatedAt: Date.now() };
    if (paymentMode) updateData.paymentMode = paymentMode;
    
    const takeaway = await Takeaway.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!takeaway) {
      return res.status(404).json({
        success: false,
        message: 'Takeaway order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: takeaway
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};