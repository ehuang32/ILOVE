// Schema for a Booking (Frees and Guestlist)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Free Schema
const freeSchema = Schema({
    'name': String,
    'isUsed': Boolean,
    'timeUsed': {
        type: Date,
        default: Date.now()
    },
    'type': String
})

// GuestList Schema
const guestlistSchema = Schema({
    'name': String,
    'type': String,
    'number': Number,
    'record': [{
        type: Date,
        default: Date.now()
    }]
})

// Booking Schema
const bookingSchema = Schema({
    'name': String,
    'type': String,
    'date': {
        type: Date,
        default: Date.now()
    },
    'package': String,
    'depositPaid': Boolean,
    'fullyPaid': Boolean,
    'frees': [freeSchema],
    'timePaid': {
        type: Date,
        default: Date.now()
    },
    'guestlist': guestlistSchema
})

mongoose.model('booking', bookingSchema);