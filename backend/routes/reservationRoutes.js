const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Create a new reservation
router.post('/', reservationController.createReservation);

// Get all reservations
router.get('/', reservationController.getAllReservations);

// Get a single reservation by ID
router.get('/:id', reservationController.getReservationById);

// Update a reservation
router.put('/:id', reservationController.updateReservation);

// Delete a reservation
router.delete('/:id', reservationController.deleteReservation);

// Update reservation status
router.patch('/:id/status', reservationController.updateReservationStatus);

module.exports = router;