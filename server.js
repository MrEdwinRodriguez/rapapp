

// DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var multer = require('multer');


//tells not to create express server
var app = express(); 

// sets initial port
var PORT = process.env.PORT || 8080; 

// BodyParser makes it easy for our server to interpret data sent to it.


app.use(express.static(process.cwd() + '/public'));

// The code below is pretty standard.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(multer().any());


// 
// ROUTER

// var rap = require('./controllers/rap_controller');
// var rap = require('./controllers/rap')
// app.use('/', rap);
// app.use('/', rap);


// LISTENER
app.listen(PORT, function() {
	console.log("The server is listening: " + PORT);
});


