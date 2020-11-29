// Schema for a Promoter (Frees and Guestlist)
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

// Promoter Schema
const promSchema = Schema({
    'frees': [freeSchema],
    'guestList': guestlistSchema
})

mongoose.model('prom', promSchema);