var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    mongoose = require('mongoose'),
    sockets = require('./lib/sockets'),
    geographyData = require('./lib/data/geography'); 

var app = express();
var server = http.createServer(app);
sockets.load(server);

mongoose.connect('mongodb://localhost/apptain_geo');

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "s3cr3t" }));
    app.use(express.errorHandler());
    app.use(app.router);
    app.set('views', __dirname + '/views');
    app.use("/styles", express.static(__dirname + '/styles'));
    app.use("/scripts", express.static(__dirname + '/scripts'));
});

app.get('/', function (req, res) {
    fs.readFile(__dirname + '/views/index.html', 'utf8', function (err, text) {
        console.log(err);
        res.send(text);
    });
});

app.get('/countries', function (req, res) {
    geographyData.getCountries(function (countries) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(countries)); 
    });
});

server.listen(4001);


