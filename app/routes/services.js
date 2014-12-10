/**
 * Created by Ale on 08.12.2014.
 */

require('../models/service');

var services = require('../controllers/services');
var changelog = require('../controllers/changelog');

module.exports = function(router) {
    router.route('/services')
        // gets a list of all services, filtered by:
        // - type
        .get(services.list)
        // creates a new service
        .post(changelog.before, services.create, changelog.after);

    router.route('/services/:serviceId')
        // gets one service by id
        .get(services.read)
        // updates one service by id
        .put(changelog.before, services.update, changelog.after);

    // Finish by binding the client middleware
    router.param('serviceId', services.serviceByID);

};