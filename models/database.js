// Connect to MongoDB Collections
const mongoose = require('mongoose');
const dbURI = "";

const options = {
    useNewUrlParser: true,
    dbName: "ILOVE",
    useUnifiedTopology: true
}

// Remove the Depracation Warning: Collection.ensureIndex is depracated
mongoose.set('useCreateIndex', true);

mongoose.connect(dbURI, options, function(err) {
    if (!err) {
        console.log("Database Connection Established!");
    } else {
        console.log("Error connecting DB: ", err);
    }
})

require('./prom.js');
require('./booking.js');