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


// routes

router.get('/', function(req,res) {
		res.sendFile(path.join(__dirname,'../public/index.html'));
});


router.get("/signup", function (req, res) {
	// res.sendfile(__dirname + "../public/signup.html");
	res.sendFile(path.join(__dirname,'../public/signup.html'));
});

router.get("/dashboard", function (req, res) {
	// res.sendfile(__dirname + "../public/signup.html");
	res.sendFile(path.join(__dirname,'../public/dashboard.html'));
});



router.post('/rapapp/newuser', function(req, res) {

	console.log(req.body)
	// saves form input into variables
	var newFirstName = req.body.first_name;
	var newLastName = req.body.last_name;
	var newUserEmail = req.body.email;
	var newUserPassword = req.body.password;
	var newUserDOBmonth = req.body.DOBMonth;
	var newUserDOBday = req.body.DOBDay;
	var newUserDOByear = req.body.DOBYear;

	

	 firebase.auth().createUserWithEmailAndPassword(newUserEmail, newUserPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]



			
        if (errorCode == 'auth/weak-password') {
          console.log('The password is too weak.');
        } else {
          console.log(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });


			var colName = ['name', 'email', 'type'];
			var colVal = [newUserName, newUserEmail, newUserType];

			writer.insertInto('users', colName, colVal, function(data){
			res.redirect('/dashboard')
				});


});


module.exports = router;