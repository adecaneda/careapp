/**
 * Created by Ale on 09.12.2014.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Changelog = mongoose.model('Changelog');
var _ = require('lodash');

var changelog = null;


/**
 * List all changes
 */
exports.list = function(req, res) {

    // Prepare query object
    var query = Changelog.find();

    // Apply filters (if any)
    // The only filter allowed is by 'model' or by 'eid'
    if (req.query.model) {
        query.where({model: req.query.model});
    }
    if (req.query.eid) {
        query.where({eid: req.query.eid});
    }

    // Execute query
    query.exec(function(err, changes) {
        if (err) {
            return res.status(400).send({
                message: 'Error in changelog'
            });
        } else {
            res.jsonp(changes);
        }
    });

};


/**
 * Hook pre modification
 */
exports.before = function(req, res, next) {
    if (req.entity) {
        // new instance to avoid overriding the previous change
        changelog = new Changelog();
        changelog.setBefore(req.entitymodel, req.entity._id, req.entity);
    }
    next();
};

/**
 * Hook post modification
 */
exports.after = function(req, res) {
    if (res.entity) {
        if (!changelog) {
            // new instance to avoid overriding the previous change
            changelog = new Changelog();
        }

        // if request method is 'delete' ignore the 'after' entity
        if (req.method == 'DELETE') {
            changelog.setAfter(res.entitymodel, res.entity._id, null);
        } else {
            changelog.setAfter(res.entitymodel, res.entity._id, res.entity);
        }

        changelog.flush(function(save) {
            if (save) {
                changelog.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    // destroy the object to avoid overriding the change of next execution
                    changelog = null;
                });
            }
        });

    }
    res.jsonp(res.entity);
};