/**
 * Created by Ale on 08.12.2014.
 */

module.exports = function(express) {
    var router = express.Router(); 				// get an instance of the express Router

    // more routes for our API will happen here
    require('./app/routes/caregivers')(router); //routes are defined here
    require('./app/routes/services')(router); //routes are defined here

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
}
