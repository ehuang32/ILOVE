// Schema for Weeks
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weekSchema = Schema({
    'name': String,
    'promoterIds': [String]
})

mongoose.model('week', weekSchema);