// backend/controllers/quickBillController.js
const QuickBill = require('../models/QuickBill');

// Create a new quick bill
exports.createQuickBill = async (req, res) => {
  try {
    const {
    
      dineInOrderItems = [],
      takeawayOrderItems = [],
      dineInDiscount = 0,
      takeawayDiscount = 0,
      paymentMethod = 'cash'
    } = req.body;

    // Calculate totals
    const dineInSubtotal = dineInOrderItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    const takeawaySubtotal = takeawayOrderItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    const subtotal = dineInSubtotal + takeawaySubtotal;
    const tax = subtotal * 0.13; // 13% tax
    const totalDiscount = dineInDiscount + takeawayDiscount;
    const total = subtotal + tax - totalDiscount;

    // Create quick bill
    const quickBill = new QuickBill({
    
      dineInOrderItems,
      takeawayOrderItems,
      dineInDiscount,
      takeawayDiscount,
      subtotal,
      tax,
      totalDiscount,
      total,
      paymentMethod,
      paymentStatus: 'paid'
    });

    await quickBill.save();
    
    res.status(201).json({
      success: true,
      message: 'Quick bill created successfully',
      data: quickBill
    });
  } catch (error) {
    console.error('Error creating quick bill:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating quick bill',
      error: error.message
    });
  }
};

// Get all quick bills with filters
exports.getAllQuickBills = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod, date, orderId } = req.query;
    
    // Build filter object
    let filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (orderId) filter.orderId = orderId;
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.billDate = { $gte: startDate, $lte: endDate };
    }
    
    const quickBills = await QuickBill.find(filter).sort({ billDate: -1 });
    
    res.json({
      success: true,
      count: quickBills.length,
      data: quickBills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quick bills',
      error: error.message
    });
  }
};

// Get a single quick bill by ID
exports.getQuickBillById = async (req, res) => {
  try {
    const quickBill = await QuickBill.findById(req.params.id);
    
    if (!quickBill) {
      return res.status(404).json({
        success: false,
        message: 'Quick bill not found'
      });
    }
    
    res.json({
      success: true,
      data: quickBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quick bill',
      error: error.message
    });
  }
};

// Get quick bill by order ID
exports.getQuickBillByOrderId = async (req, res) => {
  try {
    const quickBill = await QuickBill.findOne({ orderId: req.params.orderId });
    
    if (!quickBill) {
      return res.status(404).json({
        success: false,
        message: 'Quick bill not found'
      });
    }
    
    res.json({
      success: true,
      data: quickBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quick bill',
      error: error.message
    });
  }
};

// Update a quick bill
exports.updateQuickBill = async (req, res) => {
  try {
    const quickBill = await QuickBill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quickBill) {
      return res.status(404).json({
        success: false,
        message: 'Quick bill not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Quick bill updated successfully',
      data: quickBill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating quick bill',
      error: error.message
    });
  }
};

// Delete a quick bill
exports.deleteQuickBill = async (req, res) => {
  try {
    const quickBill = await QuickBill.findByIdAndDelete(req.params.id);
    
    if (!quickBill) {
      return res.status(404).json({
        success: false,
        message: 'Quick bill not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Quick bill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting quick bill',
      error: error.message
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    if (!['paid', 'unpaid', 'partial'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status value'
      });
    }
    
    const updateData = { paymentStatus, updatedAt: Date.now() };
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    
    const quickBill = await QuickBill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!quickBill) {
      return res.status(404).json({
        success: false,
        message: 'Quick bill not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: quickBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};