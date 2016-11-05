var express = require('express');
var router = express.Router();
var path = require('path');
var rap = require('../models/rap.js');
var firebase = require('firebase');
var app = firebase.initializeApp({ apiKey: "AIzaSyB-FKM1CKZpjJPzlfIk6xT4afP6ZGQ_KgM",
    authDomain: "spit-bars.firebaseapp.com",
    databaseURL: "https://spit-bars.firebaseio.com",
    storageBucket: "spit-bars.appspot.com",
    messagingSenderId: "810792566820"
  });

router.get('/', function(req,res) {
		res.sendFile(path.join(__dirname,'../public/index.html'));
});