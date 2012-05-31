"use strict";

if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

var express = require('express');
var app = express.createServer();
var fs = require('fs');
var util = require('util');
var DomJS = require("dom-js").DomJS;

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

function readLines(file, callback) {
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

function nodeInfo(node) {
    console.log(" ");
    console.log(" ");
    console.log("==========================");
    console.log("==========================");
    console.log(node.nodeName, ' - ', node.nodeType, ' - ', node.nodeValue, ' parent - ', node.parentNode.nodeName);
    console.log("==========================");
    console.log("==========================");
    console.log("ChildNodes length - ", node.childNodes.length);
    for (var i=0, l=node.childNodes.length; i<l; i++) {
        console.log('Child #', i, ' is ', node.childNodes[i].nodeName);
    }
    console.log(" ");
    console.log(" ");
}

function createXML(str) {
    var parser = new DomJS();
    
    parser.parse(str, function(err, dom){
        dom.children[0].name = 'newnode';
        console.log("serializes to : " + dom.toXml());
    });
        
}

readLines(fs.createReadStream('data/example.xml'), function(result){
    createXML(result);
})

app.get('/', function (req, res) {
    readLines(fs.createReadStream('data/example.xml'), function(result){
        createXML(result, res);
        res.send(result);
    })
});


app.listen(process.env.PORT || process.env.C9_PORT);