// Schema for a Booking (Frees and Guestlist)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Free Schema
const freeSchema = Schema({
    'name': String,
    'isUsed': Boolean,
    'timeUsed': {
        type: Date
    }
})

// GuestList Schema
const guestlistSchema = Schema({
    'name': String,
    'type': String,
    'number': Number,
    'record': [{
        type: Date
    }]
})

// Booking Schema
const bookingSchema = Schema({
    'type': String,
    'date': {
        type: Date
    },
    'package': String,
    'depositPaid': Boolean,
    'fullyPaid': Boolean,
    'frees': [freeSchema],
    'timePaid': {
        type: Date
    },
    'guestlist': guestlistSchema,
    'freesLimit': Number
})

mongoose.model('booking', bookingSchema);