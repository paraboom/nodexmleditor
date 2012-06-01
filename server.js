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

var ourXML;

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

function processNodes(doc) {
    var counter = 0;
    
    function processNode(node){
        node.id = counter++;
        if (node.hasOwnProperty('text')) {
            node.text = node.text.trim();
        }
        if (node.children) {
            for (var i=0,l=node.children.length; i<l; i++) {
                processNode(node.children[i]);
            }
        }
    };
    processNode(doc);
}

function findNode(id, callback) {
    var matched;
    function processNode(node){
        if (matched) return false;
        if (node.id == id) {
            matched = node;
        }
        if (node.children) {
            for (var i=0,l=node.children.length; i<l; i++) {
                processNode(node.children[i]);
            }
        }
    };
    processNode(ourXML);
    if (callback) {
        callback(matched);
    }
    return matched;
}

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
            processNodes(doc);
            ourXML = doc;
            res.render('index', {
                title: 'XML Document Editing',
                doc: doc
            });
        });
    });
});

app.post('/change/', function(req, res){
    var nodeid = req.body.id.match(/\d+/)[0];
    console.log(findNode(nodeid, function(matched){
        matched.text = req.body.text;
        fs.writeFile('data/example.xml', ourXML.toXml(), function(err){
            if (err) console.log(err);
        });
    }));
});


app.listen(process.env.PORT || process.env.C9_PORT);