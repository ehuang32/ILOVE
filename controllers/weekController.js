// Controller for Weeks

const mongoose = require('mongoose');
const Week = mongoose.model('week');

/*
ENDPOINTS:
getAllWeeks
getWeek
getWeekByName
addWeek
updateWeek
addPromoterId
removePromoterId
deleteWeek
*/

// GET REQUESTS
// ------------------------------------------------------------------------------
// Retrieve all Weeks
const getAllWeeks = (req, res) => {
    Week.find((err, week) => {
        if (!err) {
            res.send(week);
        } else {
            res.send(err);
        }
    })
}

// Retrieve a Week by ID
const getWeek = (req, res) => {
    Week.findOne({
        _id: req.params.weekId
    }, (err, week) => {
        if (!err) {
            res.send(week);
        } else {
            res.send(err);
        }
    })
}

// Retrieve a Week by Name
const getWeekByName = (req, res) => {
    Week.findOne({
        name: req.params.name
    }, (err, week) => {
        if (!err) {
            res.send(week);
        } else {
            res.send(err);
        }
    })
}

// POST REQUESTS
// ------------------------------------------------------------------------------
const addWeek = (req, res) => {
    const newWeek = new Week({
        'name': req.body.name,
        'promoterIds': req.body.promoterIds
    });
    newWeek.save((err, week) => {
        if (!err) {
            res.send(week);
        } else {
            res.send(err);
        }
    })
}

// PUT REQUESTS
// ------------------------------------------------------------------------------
// Update Week
const updateWeek = (req, res) => {
    Week.updateOne(
        {_id: req.params.weekId},
        {$set: {
            'name': req.body.name,
            'promoterIds': req.body.promoterIds
        }},
        (err, week) => {
            if (!err) {
                res.send(week);
            } else {
                res.send(err);
            }
        }
    )
}

// Add promoter to the week
const addPromoterId = (req, res) => {
    Week.updateOne(
        {_id: req.params.weekId},
        {$addToSet: {
            'promoterIds': req.body.promoterId
        }},
        (err, week) => {
            if (!err) {
                res.send(week);
            } else {
                res.send(err);
            }
        }
    )
}

// Remove promoter to the week
const removePromoterId = (req, res) => {
    Week.updateOne(
        {_id: req.params.weekId},
        {$pull: {
            'promoterIds': req.body.promoterId
        }},
        (err, week) => {
            if (!err) {
                res.send(week);
            } else {
                res.send(err);
            }
        }
    )
}

// DELETE REQUESTS
// ------------------------------------------------------------------------------
// Delete Week by ID
const deleteWeek = (req, res) => {
    Week.deleteOne(
        {_id: req.params.weekId},
        (err, week) => {
            if (!err) {
                res.send(week)
            } else {
                res.send(err)
            }
        }
    )
}

module.exports = {
    getAllWeeks,
    getWeek,
    getWeekByName,
    addWeek,
    updateWeek,
    addPromoterId,
    removePromoterId,
    deleteWeek
}