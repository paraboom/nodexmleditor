if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

var express = require('express');
var app = express.createServer();

app.configure(function () {
    app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/static'));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.send('Hello World'); 
});


app.listen(process.env.PORT || process.env.C9_PORT);