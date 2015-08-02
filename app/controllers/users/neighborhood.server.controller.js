'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Neighborhood = mongoose.model('Neighborhood'),
    _ = require('lodash');

/**
 * Create a Neighborhood
 */
exports.create = function(req, res) {
    var Neighborhood = new Neighborhood(req.body);
    Neighborhood.user = req.user;

    Neighborhood.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(Neighborhood);
        }
    });
};

/**
 * Show the current Neighborhood
 */
exports.read = function(req, res) {
    res.json(req.Neighborhood);
};

/**
 * Update a Neighborhood
 */
exports.update = function(req, res) {
    var Neighborhood = req.Neighborhood;

    Neighborhood = _.extend(Neighborhood, req.body);

    Neighborhood.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(Neighborhood);
        }
    });
};

/**
 * Delete an Neighborhood
 */
exports.delete = function(req, res) {
    var Neighborhood = req.Neighborhood;

    Neighborhood.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(Neighborhood);
        }
    });
};

/**
 * List of Neighborhoods
 */
exports.list = function(req, res) {
    Neighborhood.find().sort('-created').populate('name').exec(function(err, Neighborhoods) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(Neighborhoods);
        }
    });
};

/**
 * Neighborhood middleware
 */
exports.NeighborhoodByID = function(req, res, next, id) {
    Neighborhood.findById(id).populate('user', 'displayName').exec(function(err, Neighborhood) {
        if (err) return next(err);
        if (!Neighborhood) return next(new Error('Failed to load Neighborhood ' + id));
        req.Neighborhood = Neighborhood;
        next();
    });
};

/**
 * Neighborhood authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.Neighborhood.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};