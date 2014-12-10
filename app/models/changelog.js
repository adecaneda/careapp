/**
 * Created by Ale on 09.12.2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var changelogSchema = new Schema({
    // Entity identifier
    eid: {
        type: String,
        required: true
    },

   // Entity model name
    model: {
        type: String,
        required: true
    },

    // Original state before the change
    state_from: [],

    // Final state after the change
    state_to: [],

    // Change date
    date: {
        type: Date,
        default: Date.now
    }
});


//////////////////////////////////////////////
// Custom methods
//////////////////////////////////////////////

var _before = null;
var _after = null;
var _model = '';
var _id = '';

changelogSchema.methods = {
    /**
     * Sets the previous state
     *
     * @param model Model name
     * @param id Entity id
     * @param entity Previous state object
     */
    setBefore: function (model, id, entity) {

        // validate 'before' entity
        if (model && id && entity) {
            _model = model;
            _id = id;
            _before = entity.toJSON();

        // reset everything
        } else {
            _before = _model = _id = null;
        }
    },

    /**
     * Sets the final state
     *
     * @param model Model name
     * @param id Entity id
     * @param entity Final state object
     */
    setAfter: function (model, id, entity) {

        // validate 'after' entity
        if (model && id && entity) {
            _after = entity.toJSON();
        }

        // take model and id if before doesn't exist
        if (!_before) {
            _model = model;
            _id = id;

        // check data consistency
        } else if ((id.toString() != _id.toString() || model != _model)) {
            // something went wrong
            _before = null;
            _after = null;
        }
    },

    /**
     * Prepares the data before saving
     *
     * @param callback Function to give the control back
     */
    flush: function (callback) {

        // entity was removed
        if (!_id || !_model) {
            return callback(true);
        }

        // init data
        this.eid = _id;
        this.model = _model;
        this.state_from = _before;
        this.state_to = _after;

        if (!_after && !_before) {
            // reset state
            _before = _after = _model = _id = null;
            return callback(false);
        }

        _.forEach(_before, function (before, key) {

            var areEqual = false;

            // detect keys with the same content ..
            if (_after[key] != undefined) {
                var after = _after[key];

                // Date
                if (_.isDate(before) && _.isDate(after)) {
                    var d1 = new Date(before);
                    var d2 = new Date(after);
                    areEqual = d1.getTime() == d2.getTime();

                // Array
                } else if (_.isArray(before) && _.isArray(after)) {
                    // @todo this comparison algorithm fails on array of objects
                    var arr1 = [];
                    before.forEach(function(value) {
                        var val1 = _.isObject(value) ? value.toString() : value;
                        arr1.push(val1);
                    });
                    var arr2 = [];
                    after.forEach(function(value) {
                        var val2 = _.isObject(value) ? value.toString() : value;
                        arr2.push(val2);
                    });

                    // We must check both the differences in both directions
                    var diff = _.difference(arr1, arr2);
                    if (diff.length == 0) {
                        diff = _.difference(arr2, arr1);
                    }
                    areEqual = diff.length == 0;

                // best effort comparison for objects that are not date, nor arrays
                } else if (_.isObject(before) && _.isObject(after)) {
                    areEqual = before.toString() === after.toString();

                // otherwise
                } else {
                    areEqual = before === after;
                }
            }

            // .. and remove them
            if (areEqual) {
                delete _after[key];
                delete _before[key];
            }

        });
        // if both objects are empty then there was no change actually
        var areEqual = _.isEmpty(_before) && _.isEmpty(_after);

        // reset state
        _before = _after = _model = _id = null;

        return callback(!areEqual);
    }
};

module.exports = mongoose.model('Changelog', changelogSchema);
