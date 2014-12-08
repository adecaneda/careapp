/**
 * Created by Ale on 08.12.2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Gender constants
var GENDER_MALE = 'male';
var GENDER_FEMALE = 'female';

var caregiverSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: [GENDER_MALE, GENDER_FEMALE],
        required: true
    }
});

module.exports = mongoose.model('Caregiver', caregiverSchema);
