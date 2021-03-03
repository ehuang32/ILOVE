// Schema for a Promoter (Frees and Guestlist)
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

// Promoter Schema
const promSchema = Schema({
    'frees': [freeSchema],
    'guestlist': guestlistSchema,
    'freesLimit': Number
})

mongoose.model('prom', promSchema);
mongoose.model('free', freeSchema);
mongoose.model('guestlist', guestlistSchema);