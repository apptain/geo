var mongoose = require('mongoose'), 
    GeographyModel = require('../model/geography'),
    Country = mongoose.model('Country'),
    StateProvince = mongoose.model('StateProvince');

exports.getCountries = function(callback) {
    Country.find({}, function (err, countries) {
        callback(countries);
    });
}

exports.getCountries = function (callback) {
    Country.find({}, function (err, countries) {
        callback(countries);
    });
}
