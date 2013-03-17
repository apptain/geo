var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

exports.updateEntity = function (entityName, id, propertyName, propertyValue) {
    var entity = mongoose.model(entityName.toString());
    entity.findOne({ _id: id }, function (err, instance) {
        instance[propertyName] = propertyValue;
        instance.save();
    });
} 

