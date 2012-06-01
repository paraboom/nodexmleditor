"use strict";

if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

var express = require('express');
var jade = require('jade');
var app = express.createServer();
var fs = require('fs');
var util = require('util');
var DomJS = require("dom-js").DomJS;

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
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

function readFile(file, callback) {
    var result = '';
    
    file.on('data', function(data){
        result += data;
    });
    
    file.on('end', function(){
        if (callback && typeof(callback) == 'function') {
            callback(result);
        }
    });
};

function createXML(str, callback) {
    var parser = new DomJS();
    
    parser.parse(str, function(err, dom){
        dom.children[0].name = 'newnode';
        callback(dom);
        // console.log("serializes to : " + dom.toXml());
    });    
}

app.get('/', function(req, res){
    readFile(fs.createReadStream('data/example.xml'), function(result){
        result = result.replace(/[\n\t]/g, '').replace(/>\s*</g, '><');
        createXML(result, function(doc){
            res.render('index', {
                title: 'XML Document Editing',
                doc: doc
            });
            fs.writeFile('data/example.xml', doc.toXml(), function(err){
                if (err) console.log(err);
            });
        });
    });
});


app.listen(process.env.PORT || process.env.C9_PORT);