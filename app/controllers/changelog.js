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
        changelog.setAfter(res.entitymodel, res.entity._id, res.entity);

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