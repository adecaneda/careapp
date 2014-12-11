/**
 * Created by Ale on 08.12.2014.
 */

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Put this somewhere else
require('./app/models/changelog');

// --------------------------------------------------------
// ROUTES CONFIGURATION
// Get an instance of the express Router
var router = express.Router();

// Routes for caregivers
require('./app/routes/caregivers')(router);
// Routes for services
require('./app/routes/services')(router);
// Routes for customers
require('./app/routes/customers')(router);
// Routes for changelog
require('./app/routes/changelog')(router);

// Register the router (prefixed with /api)
app.use('/api', router);

// --------------------------------------------------------
// DATABASE CONNECTION
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/careapp'); // connect to our database

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    res.sendFile('./public/index.html');
});

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; 		// set our port
app.listen(port);
console.log('Connected on port ' + port);