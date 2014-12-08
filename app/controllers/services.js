/**
 * Created by Ale on 08.12.2014.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Service = mongoose.model('Service');
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
                message = 'Service already exists';
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
 * List all services
 */
exports.list = function(req, res) {

    // Prepare query object
    var query = Service.find();

    // Apply filters (if any)
    // The only filter allowed is by 'type'
    if (req.query.type) {
        query.where({type: req.query.type});
    }

    // Execute query
    query.exec(function(err, services) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(services);
            }
        });

};

/**
 * Create a service
 */
exports.create = function(req, res) {
    var service = new Service(req.body);

    service.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(service);
        }
    });
};

/**
 * Show the current service in the request
 */
exports.read = function(req, res) {
    res.jsonp(req.service);
};

/**
 * Update the current service in the request
 */
exports.update = function(req, res) {
    var service = _.extend(req.service, req.body);
    service.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(service);
        }
    });
};

/**
 * Service middleware
 */
exports.serviceByID = function(req, res, next, id) {
    Service.findById(id, function(err, service) {
            if (err) return next(err);
            if (!service) return next(new Error('Failed to load service ' + id));
            req.service = service;
            next();
        });
};
