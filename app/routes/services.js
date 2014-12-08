/**
 * Created by Ale on 08.12.2014.
 */

require('../models/service');

var services = require('../controllers/services');

module.exports = function(router) {
    router.route('/services')
        // gets a list of all services
        .get(services.list)
        // creates a new service
        .post(services.create);

    router.route('/services/:serviceId')
        // gets one service by id
        .get(services.read)
        // updates one service by id
        .put(services.update);

    // Finish by binding the client middleware
    router.param('serviceId', services.serviceByID);

};