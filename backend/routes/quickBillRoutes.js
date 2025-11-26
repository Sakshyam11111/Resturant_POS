// backend/routes/quickBillRoutes.js
const express = require('express');
const router = express.Router();
const quickBillController = require('../controllers/quickBillController');

// Create a new quick bill
router.post('/', quickBillController.createQuickBill);

// Get all quick bills
router.get('/', quickBillController.getAllQuickBills);

// Get a single quick bill by ID
router.get('/:id', quickBillController.getQuickBillById);

// Get quick bill by order ID
router.get('/order/:orderId', quickBillController.getQuickBillByOrderId);

// Update a quick bill
router.put('/:id', quickBillController.updateQuickBill);

// Delete a quick bill
router.delete('/:id', quickBillController.deleteQuickBill);

// Update payment status
router.patch('/:id/payment', quickBillController.updatePaymentStatus);

module.exports = router;