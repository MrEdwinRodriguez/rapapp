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


router.get("/reset", function (req, res) {
	// res.sendfile(__dirname + "../public/signup.html");
	res.sendFile(path.join(__dirname,'../public/email.html'));
});



router.post('/spitbars/newuser', function(req, res) {

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

	 		var user = firebase.auth().currentUser;
			var name, email, photoUrl, uid;



				if (user != null) {
				 name = user.displayName;
				 email = user.email;
				 photoUrl = user.photoURL;
				 uid = user.uid; 

			var colName = ['firstname', 'lastname','email', 'month', 'day', 'year', 'uid'];
			var colVal = [newFirstName, newLastName, newUserEmail, newUserDOBmonth, newUserDOBday, newUserDOByear, uid];

			rap.insertInto('users', colName, colVal, function(data){
			res.redirect('/dashboard')
				});
				}
	 		// variable stores name of columes in DB



});


// existing user signin
router.post('/spitbars/login', function(req, res) {
	
	console.log(req.body)
	// var newUserName = 'place holder';
	var userEmail = req.body.user_email;
	var userPassword = req.body.user_password;
	// var newUserType = 'student';
	

	

	        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });

// session begins here
	 		var user = firebase.auth().currentUser;
			var name, email, photoUrl, uid;



				if (user != null) {
				 
				 email = user.email;				 
				 uid = user.uid;
				 // console.log(uid)
				var colName = ['uid'];
				var colVal= [uid];
			// var colVal = [newUserName, newUserEmail, newUserType];


				rap.select('users', colName, colVal, function(user){
					console.log(user.id)
                req.session.user_id = user.id;
                req.session.first_name = user.first_name;
                req.session.last_name = user.last_name;
                req.session.user_email = user.email;

                var token = jwt.sign({
                    password_hash: user.password_hash
                }, app.get('jwtSecret'), {
                    expiresIn: 60 * 60 * 15
                })

                console.log("Token")
                console.log(token)



				res.redirect('/dashboard')
				});

				
				 }; 

});


router.post('/spitbars/reset', function(req, res) {
	
    
      var email = req.body.email;
      console.log(email)
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });


});
module.exports = router;