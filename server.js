// Middlewares
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const path = require('path');
const server = express();

// Allows cross origin requests from localhost port 8000
server.use(cors());

// Express Body Parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Database Setup
require('./models/database.js');

// Routes Setup
const promRoutes = require('./routes/promRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');

// Specify which routes app will use
server.use('/api', promRoutes);
server.use('/api', bookingRoutes);

// Homepage
server.get('/api', function(req, res) {
    res.send('<h1> Hello, welcome to ILOVE <h1>');
});

// Start the Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, function(req, res) {
    console.log(`Server running on port ${PORT}`);
});