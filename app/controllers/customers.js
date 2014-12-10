/**
 * Created by Ale on 08.12.2014.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var _ = require('lodash');

/**
 * List all customers
 */
exports.list = function(req, res) {
    Customer.find(function (err, customers) {
        if (err) {
            return res.send(err);
        } else {
            res.json(customers);
        }
    });
};

/**
 * Create a customer
 */
exports.create = function(req, res, next) {
    var customer = new Customer(req.body);

    // Save the data
    return doSaveCustomer(req, res, customer, next);
};

/**
 * Show the current customer in the request
 */
exports.read = function(req, res) {
    res.jsonp(req.entity);
};

/**
 * Update the current customer in the request
 */
exports.update = function(req, res, next) {
    // Modify the current customer with the data in the request
    var customer = _.extend(req.entity, req.body);

    // Save the data
    return doSaveCustomer(req, res, customer, next);
};

/**
 * Adds a new service to the customer
 */
exports.addService = function(req, res, next) {
    var customer = req.entity;

    // Call the model
    customer.addService(req.body.serviceId);

    // Save the data
    return doSaveCustomer(req, res, customer, next);
};

/**
 * Removes an existing service from the customer
 */
exports.removeService = function(req, res, next) {
    var customer = req.entity;

    // Call the model
    customer.removeService(req.body.serviceId);

    // Save the data
    return doSaveCustomer(req, res, customer, next);
};

/**
 * Customer middleware
 * Reads a customer entity by its id and stores it in the request as req.entity
 */
exports.customerByID = function(req, res, next, id) {
    Customer.findById(id, function(err, customer) {
        if (err) return next(err);
        if (!customer) return next(new Error('Failed to load customer ' + id));
        req.entity = customer;
        req.entitymodel = 'Customer';
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
 * @param customer
 * @param next
 */
var doSaveCustomer = function(req, res, customer, next) {
    customer.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.entity = customer;
            res.entitymodel = 'Customer';
            if (next) {
                next();
            } else {
                res.jsonp(customer);
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
                message = 'Customer already exists';
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
