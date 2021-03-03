// Controller for Bookings

const mongoose = require('mongoose');
const Booking = mongoose.model('booking');

/*
ENDPOINTS:
getAllBookings
getBooking
updateBooking
updateFrees
updateGL
addBooking
deleteBooking
*/

// GET REQUESTS
// ------------------------------------------------------------------------------
// Retrieve all bookings
const getAllBookings = (req, res) => {
    Booking.find((err, booking) => {
        if (!err) {
            res.send(booking);
        } else {
            res.send(err);
        }
    })
}

// Retrieve a booking by ID
const getBooking = (req, res) => {
    Booking.findOne({
        _id: req.params.bookingId
    }, (err, booking) => {
        if (!err) {
            res.send(booking);
        } else {
            res.send(err);
        }
    })
}


// POST REQUESTS
// ------------------------------------------------------------------------------
// Add a new Booking
const addBooking = (req, res) => {
    const newBooking = new Booking({
        'name': req.body.name,
        'type': req.body.type,
        'date': req.body.date,
        'package': req.body.package,
        'depositPaid': req.body.depositPaid,
        'fullyPaid': req.body.fullyPaid,
        'frees': req.body.frees,
        'timePaid': req.body.timePaid,
        'guestlist': req.body.guestlist,
        'freesLimit': req.body.freesLimit
    });
    newBooking.save((err, booking) => {
        if (!err) {
            res.send(booking);
        } else {
            res.send(err);
        }
    })
}


// PUT REQUESTS
// ------------------------------------------------------------------------------
// Update Booking
const updateBooking = (req, res) => {
    Booking.updateOne(
        {_id: req.params.bookingId},
        {$set: {
            'name': req.body.name,
            'type': req.body.type,
            'date': req.body.date,
            'package': req.body.package,
            'depositPaid': req.body.depositPaid,
            'fullyPaid': req.body.fullyPaid,
            'frees': req.body.frees,
            'timePaid': req.body.timePaid,
            'guestlist': req.body.guestlist,
            'freesLimit': req.body.freesLimit
        }},
        (err, booking) => {
            if (!err) {
                res.send(booking)
            } else {
                res.send(err)
            }
        }
    )
}

// Update Frees
const updateFrees = (req, res) => {
    Booking.updateOne(
        {_id: req.params.bookingId},
        {$set: {
            'frees': req.body
        }},
        (err, booking) => {
            if (!err) {
                res.send(booking);
            } else {
                res.send(err)
            }
        }
    )

}

// Update Guestlist
const updateGL = (req, res) => {
    Booking.updateOne(
        {_id: req.params.bookingId},
        {$set: {
            'guestlist': req.body   
        }},
        (err, booking) => {
            if (!err) {
                res.send(booking);
            } else {
                res.send(err)
            }
        }
    )
}

// DELETE REQUESTS
// ------------------------------------------------------------------------------
// Delete Booking by ID
const deleteBooking = (req, res) => {
    Booking.deleteOne(
        {_id: req.params.bookingId},
        (err, booking) => {
            if (!err) {
                res.send(booking)
            } else {
                res.send(err)
            }
        }
    )
}

module.exports = {
    getAllBookings,
    getBooking,
    updateBooking,
    updateFrees,
    updateGL,
    addBooking,
    deleteBooking
}