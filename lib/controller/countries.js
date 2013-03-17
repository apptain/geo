var mongoose = require('mongoose'), 
    GeographyModel = require('../model/geography'),
    Country = mongoose.model('Country'),
    StateProvince = mongoose.model('StateProvince');

exports.GetCountries = function(callback) {
    mongoose.connect('mongodb://localhost/apptain_geo');
    Country.find({}, function (err, countries) {
        callback(countries);
        mongoose.connection.close();
    });
}
