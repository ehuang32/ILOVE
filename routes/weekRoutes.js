// Routes for Weeks
const express = require('express');
const weekRouter = express.Router();
const weekController = require('../controllers/weekController.js');

// Get all Weeks
weekRouter.get('/week/allWeeks', weekController.getAllWeeks);

// Get Week by ID
weekRouter.get('/week/:weekId', weekController.getWeek);

// Get Week by Name
weekRouter.get('/week/getWeekByName/:name', weekController.getWeekByName);

// Add a Week
weekRouter.post('/week/add', weekController.addWeek);

// Update Week
weekRouter.put('/week/updateWeek/:weekId', weekController.updateWeek);

// Add Promoter to Week
weekRouter.put('/week/addPromoter/:weekId', weekController.addPromoterId);

// Remove Promoter to Week
weekRouter.put('/week/removePromoter/:weekId', weekController.removePromoterId);

// Delete a Week
weekRouter.delete('/week/deleteWeek/:weekId', weekController.deleteWeek);

module.exports = weekRouter;