/**
 * Created by Ale on 08.12.2014.
 */

require('../models/caregiver');

var caregivers = require('../controllers/caregivers');
var changelog = require('../controllers/changelog');

module.exports = function(router) {
    router.route('/caregivers')
        // gets a list of all caregivers
        .get(caregivers.list)
        // creates a new caregiver
        .post(changelog.before, caregivers.create, changelog.after);

    router.route('/caregivers/:caregiverId')
        // gets one caregiver by id
        .get(caregivers.read)
        // updates one caregiver by id
        .put(changelog.before, caregivers.update, changelog.after);


    // Finish by binding the client middleware
    router.param('caregiverId', caregivers.caregiverByID);

};