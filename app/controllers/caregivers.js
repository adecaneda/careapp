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
exports.create = function(req, res, next) {
    var caregiver = new Caregiver(req.body);

    // Save the data
    return doSaveEntity(req, res, caregiver, next);
};

/**
 * Show the current caregiver in the request
 */
exports.read = function(req, res) {
    res.jsonp(req.entity);
};

/**
 * Update the current caregiver in the request
 */
exports.update = function(req, res, next) {
    var caregiver = _.extend(req.entity, req.body);

    // Save the data
    return doSaveEntity(req, res, caregiver, next);
};

/**
 * Caregiver middleware
 * Reads a service entity by its id and stores it in the request as req.entity
 */
exports.caregiverByID = function(req, res, next, id) {
    Caregiver.findById(id, function(err, caregiver) {
            if (err) return next(err);
            if (!caregiver) return next(new Error('Failed to load caregiver ' + id));
            req.entity = caregiver;
            req.entitymodel = 'Caregiver';
            next();
        });
};


// ----------------------------------------
// Custom methods

/**
 * Common save stuff
 *
 * @param req
 * @param res
 * @param entity
 * @param next
 */
var doSaveEntity = function(req, res, entity, next) {
    entity.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.entity = entity;
            res.entitymodel = 'Caregiver';
            if (next) {
                next();
            } else {
                res.jsonp(entity);
            }
        }
    });
};

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
