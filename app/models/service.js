/**
 * Created by Ale on 08.12.2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Service type constants
var TYPE_COMPANIONSHIP = 'companionship';
var TYPE_MEDICAL = 'medical';
var TYPE_PHYSICAL = 'physical';
var TYPE_INDIVIDUAL = 'individual';

var serviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [TYPE_COMPANIONSHIP, TYPE_MEDICAL, TYPE_PHYSICAL, TYPE_INDIVIDUAL],
        required: true
    }
});

module.exports = mongoose.model('Service', serviceSchema);
