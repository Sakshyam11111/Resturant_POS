// backend/routes/takeawayRoutes.js 
const express = require('express');
const router = express.Router();
const {
  createTakeaway,
  getAllTakeaways,
  getTakeawayById,
  getTakeawayByOrderId,
  updateTakeaway,
  deleteTakeaway,
  updateTakeawayStatus,
  updatePaymentStatus
} = require('../controllers/takeawayController');

router.post('/', createTakeaway);                    
router.get('/', getAllTakeaways);                    
router.get('/:id', getTakeawayById);                 
router.get('/order/:orderId', getTakeawayByOrderId); 

router.put('/:id', updateTakeaway);                
router.delete('/:id', deleteTakeaway);              

router.patch('/:id/status', updateTakeawayStatus);   
router.patch('/:id/payment', updatePaymentStatus);   

module.exports = router;