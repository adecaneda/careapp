/**
 * Created by Ale on 08.12.2014.
 */

require('../models/changelog');

var changelog = require('../controllers/changelog');

module.exports = function(router) {
    router.route('/changelog')
        // gets a list of all changes, filtered by:
        // - model
        // - eid
        .get(changelog.list);

};