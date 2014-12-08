/**
 * Created by Ale on 08.12.2014.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Caregiver = mongoose.model('Caregiver');
var _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Caregiver already exists';
                break;
            default:
                message = 'Something went wrong';
        }

    } else if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }

    } else if (err.message) {
        message = err.message;
    }

    return message;
};

/**
 * List all caregivers
 */
exports.list = function(req, res) {
    Caregiver.find(function (err, caregivers) {
        if (err) {
            return res.send(err);
        } else {
            res.json(caregivers);
        }
    });
};

/**
 * Create a caregiver
 */
exports.create = function(req, res) {
    var caregiver = new Caregiver(req.body);

    caregiver.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(caregiver);
        }
    });
};

/**
 * Show the current caregiver in the request
 */
exports.read = function(req, res) {
    res.jsonp(req.caregiver);
};

/**
 * Update the current caregiver in the request
 */
exports.update = function(req, res) {
    var caregiver = _.extend(req.caregiver, req.body);
    caregiver.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(caregiver);
        }
    });
};

/**
 * Caregiver middleware
 */
exports.caregiverByID = function(req, res, next, id) {
    Caregiver.findById(id, function(err, caregiver) {
            if (err) return next(err);
            if (!caregiver) return next(new Error('Failed to load caregiver ' + id));
            req.caregiver = caregiver;
            next();
        });
};
