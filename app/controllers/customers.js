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
exports.create = function(req, res) {
    var customer = new Customer(req.body);

    customer.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(customer);
        }
    });
};

/**
 * Show the current customer in the request
 */
exports.read = function(req, res) {
    res.jsonp(req.customer);
};

/**
 * Update the current customer in the request
 */
exports.update = function(req, res) {
    // Modify the current customer with the data in the request
    var customer = _.extend(req.customer, req.body);

    // Save the data
    return doSaveCustomer(req, res, customer);
};

/**
 * Adds a new service to the customer
 */
exports.addService = function(req, res) {
    var customer = req.customer;

    // Call the model
    customer.addService(req.body.serviceId);

    return doSaveCustomer(req, res, customer);
};

/**
 * Removes an existing service from the customer
 */
exports.removeService = function(req, res) {
    var customer = req.customer;

    // Call the model
    customer.removeService(req.body.serviceId);

    return doSaveCustomer(req, res, customer);
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {
    Customer.findById(id, function(err, customer) {
        if (err) return next(err);
        if (!customer) return next(new Error('Failed to load customer ' + id));
        req.customer = customer;
        next();
    });
};


// ----------------------------------------
// Custom methods

/**
 * Short cut
 */
var doSaveCustomer = function(req, res, customer) {
    customer.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(customer);
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
