/**
 * Created by Ale on 08.12.2014.
 */

require('../models/caregiver');

var caregivers = require('../controllers/caregivers');

module.exports = function(router) {
    router.route('/caregivers')
        // gets a list of all caregivers
        .get(caregivers.list)
        // creates a new caregiver
        .post(caregivers.create);

    router.route('/caregivers/:caregiverId')
        // gets one caregiver by id
        .get(caregivers.read)
        // updates one caregiver by id
        .put(caregivers.update);


    // Finish by binding the client middleware
    router.param('caregiverId', caregivers.caregiverByID);

};