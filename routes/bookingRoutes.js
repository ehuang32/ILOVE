// Routes for Bookings
const express = require('express');
const bookingRouter = express.Router();
const bookingController = require('../controllers/bookingController.js');

// Get all Bookings
bookingRouter.get('/booking/allBookings', bookingController.getAllBookings);

// Get Booking by ID
bookingRouter.get('/booking/:bookingId', bookingController.getBooking);

// Add a Booking
bookingRouter.post('/booking/add', bookingController.addBooking);

// Update Booking
bookingRouter.put('/booking/updateBooking/:bookingId', bookingController.updateBooking);

// Change free isUsed status
bookingRouter.put('/booking/updateFrees/:bookingId', bookingController.updateFrees);

// Update GL Number
bookingRouter.put('/booking/updateGL/:bookingId', bookingController.updateGL);

// Delete a Booking
bookingRouter.delete('/booking/deleteBooking/:bookingId', bookingController.deleteBooking);

module.exports = bookingRouter;