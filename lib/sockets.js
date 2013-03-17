var redis = require('redis'),
    sio = require('socket.io'),
    entityContext = require('./entity'),
    geographyData = require('./data/geography'); 

exports.load = function(server) {

    var io = sio.listen(server);
    io.set('transports', ['xhr-polling']);
    var client = redis.createClient();
    io.set("store", new sio.RedisStore);

    io.sockets.on('connection', function (socket) {
        socket.on('getCountries', function () {
            emitCountries = function (data) {
                socket.emit('countries', data);
            }
            geographyData.getCountries(emitCountries);
        });

        socket.on('updateEntityProperty', function (entity) {
            console.log(entity);
            entityContext.updateEntity(entity.entity, entity.id, entity.prop.property, entity.prop.newValue);
        });
    });
}
