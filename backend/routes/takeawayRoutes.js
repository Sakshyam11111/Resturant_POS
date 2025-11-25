// backend/routes/takeawayRoutes.js
const express = require("express");
const router = express.Router();
const takeawayController = require("../controllers/takeawayController");

// Create a new takeaway order
router.post("/", takeawayController.createTakeaway);

// Get all takeaway orders
router.get("/", takeawayController.getAllTakeaways);

// Get a single takeaway order by ID
router.get("/:id", takeawayController.getTakeawayById);

// Get takeaway order by order ID
router.get("/order/:orderId", takeawayController.getTakeawayByOrderId);

// Update a takeaway order
router.put("/:id", takeawayController.updateTakeaway);

// Delete a takeaway order
router.delete("/:id", takeawayController.deleteTakeaway);

// Update takeaway status
router.patch("/:id/status", takeawayController.updateTakeawayStatus);

// Update payment status
router.patch("/:id/payment", takeawayController.updatePaymentStatus);

module.exports = router;
