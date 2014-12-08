/**
 * Created by Ale on 08.12.2014.
 */

require('../models/customer');

var customers = require('../controllers/customers');

module.exports = function(router) {
    router.route('/customers')
        // gets a list of all customers
        .get(customers.list)
        // creates a new customer
        .post(customers.create);

    router.route('/customers/:customerId')
        // gets one customer by id
        .get(customers.read)
        // updates one customer by id
        .put(customers.update);

    // adds a service to the customer
    router.route('/customers/:customerId/addService')
        .post(customers.addService);

    // removes a service from the customer
    router.route('/customers/:customerId/removeService')
        .post(customers.removeService);


    // Finish by binding the client middleware
    router.param('customerId', customers.customerByID);

};