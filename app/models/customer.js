/**
 * Created by Ale on 08.12.2014.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

// Gender constants
var GENDER_MALE = 'male';
var GENDER_FEMALE = 'female';

var customerSchema = new Schema({
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
    },
    birth_date: Date,
    services: [{
        type: Schema.Types.ObjectId,
        index: { unique: true },
        ref: 'Service'
    }]
});

//////////////////////////////////////////////
// Custom methods
//////////////////////////////////////////////

customerSchema.methods = {
    /**
     * Adds a service to the current customer, if it doesn't exist.
     *
     * @param serviceId Service to be added
     * @returns {boolean} TRUE if success, otherwise FALSE
     */
    addService: function (serviceId) {

        // Check if the service exists in the array
        var index = this.services.indexOf(serviceId.toString());
        if (index == -1) {
            this.services.push(serviceId);
            return true;
        }
        return false;
    },

    /**
     * Removes a service to the current customer, if it exist.
     *
     * @param serviceId Service to be added
     * @returns {boolean} TRUE if success, otherwise FALSE
     */
    removeService: function (serviceId) {
        // Check if the service exists in the array
        var index = this.services.indexOf(serviceId.toString());
        if (index != -1) {
            this.services.splice(index, 1);
            return true;
        }
        return false;
    }
};

module.exports = mongoose.model('Customer', customerSchema);
