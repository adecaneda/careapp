/**
 * Created by Ale on 08.12.2014.
 */

require('../models/customer');

var customers = require('../controllers/customers');
var changelog = require('../controllers/changelog');

module.exports = function(router) {
    router.route('/customers')
        // gets a list of all customers
        .get(customers.list)
        // creates a new customer
        .post(changelog.before, customers.create, changelog.after);

    router.route('/customers/:customerId')
        // gets one customer by id
        .get(customers.read)
        // updates one customer by id
        .put(changelog.before, customers.update, changelog.after)
        // deletes one customer by id
        .delete(changelog.before, customers.delete, changelog.after);

    // adds a service to the customer
    router.route('/customers/:customerId/addService')
        // param: serviceId
        .post(changelog.before, customers.addService, changelog.after);

    // removes a service from the customer
    router.route('/customers/:customerId/removeService')
        // param: serviceId
        .post(changelog.before, customers.removeService, changelog.after);


    // Finish by binding the client middleware
    router.param('customerId', customers.customerByID);

};