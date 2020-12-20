// Routes for Proms
const express = require('express');
const promRouter = express.Router();
const promController = require('../controllers/promController.js');

// Get all Promoters
promRouter.get('/prom/allProms', promController.getAllPromoters);

// Get Promoter by ID
promRouter.get('/prom/:promId', promController.getPromoter);

// Add a Promoter
promRouter.post('/prom/add', promController.addPromoter);

// Update Promoter
promRouter.put('/prom/updateProm/:promId', promController.updateProm);

// Change free isUsed status
promRouter.put('/prom/updateFrees/:promId', promController.updateFrees);

// Update GL Number
promRouter.put('/prom/updateGL/:promId', promController.updateGL);

// Delete a Promoter
promRouter.delete('/prom/deleteProm/:promId', promController.deleteProm);

module.exports = promRouter;