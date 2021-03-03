// Controller for promoters

const mongoose = require('mongoose');
const Promoter = mongoose.model('prom');

/*
ENDPOINTS:
getAllPromoters
getPromoter
updateProm
updateFrees
updateGL
addPromoter
deleteProm
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

// Retrieve a promoter by ID
const getPromoter = (req, res) => {
    Promoter.findOne({
        _id: req.params.promId
    }, (err, promoter) => {
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
        'guestlist': req.body.guestlist,
        'freesLimit': req.body.freesLimit
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
// Update Promoter
const updateProm = (req, res) => {
    Promoter.updateOne(
        {_id: req.params.promId},
        {$set: {
            'frees': req.body.frees,
            'guestlist': req.body.guestlist,
            'freesLimit': req.body.freesLimit
        }},
        (err, promoter) => {
            if (!err) {
                res.send(promoter)
            } else {
                res.send(err)
            }
        }
    )
}

// Update Frees (used for use/un-use frees)
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

// Update Guestlist (used for +-)
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
// Delete Promoter by ID
const deleteProm = (req, res) => {
    Promoter.deleteOne(
        {_id: req.params.promId},
        (err, promoter) => {
            if (!err) {
                res.send(promoter)
            } else {
                res.send(err)
            }
        }
    )
}

module.exports = {
    getAllPromoters,
    getPromoter,
    updateProm,
    updateFrees,
    updateGL,
    addPromoter,
    deleteProm
}