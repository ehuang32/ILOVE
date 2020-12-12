// Controller for promoters

const mongoose = require('mongoose');
const Promoter = mongoose.model('prom');
const Free = mongoose.model('free');
const Guestlist = mongoose.model('guestlist');

/*
ENDPOINTS:
getAllPromoters
updateFrees
updateGL
addPromoter
*/

// GET REQUESTS
// ------------------------------------------------------------------------------
// Retrieve all promoters
const getAllPromoters = (req, res) => {
    Promoter.find((err, promoter) => {
        if (!err) {
            res.send(promoter);
        } else {
            res.send(err);
        }
    })
}


// POST REQUESTS
// ------------------------------------------------------------------------------
const addPromoter = (req, res) => {
    const newPromoter = new Promoter({
        'frees': req.body.frees,
        'guestlist': req.body.guestlist
    });
    newPromoter.save((err, promoter) => {
        if (!err) {
            res.send(promoter);
        } else {
            res.send(err);
        }
    })
}


// PUT REQUESTS
// ------------------------------------------------------------------------------
// Update Frees
const updateFrees = (req, res) => {
    Promoter.updateOne(
        {_id: req.params.promId},
        {$set: {
            'frees': req.body
        }},
        (err, promoter) => {
            if (!err) {
                res.send(promoter);
            } else {
                res.send(err)
            }
        }
    )

}

// Update Guestlist
const updateGL = (req, res) => {
    Promoter.updateOne(
        {_id: req.params.promId},
        {$set: {
            'guestlist': req.body
        }},
        (err, promoter) => {
            if (!err) {
                res.send(promoter);
            } else {
                res.send(err)
            }
        }
    )
}

// DELETE REQUESTS
// ------------------------------------------------------------------------------

module.exports = {
    getAllPromoters,
    updateFrees,
    updateGL,
    addPromoter
}