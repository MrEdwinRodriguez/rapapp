var express = require('express');
var router = express.Router();
var path = require('path');
var rap = require('../models/rap.js');
var firebase = require('firebase');
// var multer  = require('multer');
var FormData = require('form-data');
var fs = require('fs');
// var upload = multer({ dest: '../public/uploads/' });
var jwt = require('jsonwebtoken');
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

router.get('/recorder', function(req,res) {
    res.sendFile(path.join(__dirname,'../views/dashboard/recorder.html'));
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
	 		



});


// existing user signin
router.post('/spitbars/login', function(req, res) {
	
	console.log(req.body)
	// var newUserName = 'place holder';
	var userEmail = req.body.user_email;
	var userPassword = req.body.user_password;
	// var newUserType = 'student';
	

	

	        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)


          .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          
          if (errorCode === 'auth/wrong-password') {
            console.log('Wrong password.');
          } else {
            console.log(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });

	        
				if (userEmail) {
				 console.log('checking if')
				 email = userEmail;				 
				
				 // console.log(uid)
				var colName = ['email'];
				var colVal= [email];
			// var colVal = [newUserName, newUserEmail, newUserType];
console.log('calling db')

				rap.selectUser('users', colName, colVal, function(user){
					console.log(user)
					
                req.session.user_id = user.id;
                req.session.fb_user_id = user.uid;
                req.session.first_name = user.firstname;
                req.session.last_name = user.lastname;
                req.session.user_email = user.email;

                var token = jwt.sign({
                    password_hash: user.password_hash
                }, 'password', {
                    expiresIn: 60 * 60 * 15
                })

                console.log("Token")
                console.log(token)

                console.log(user[0])
                console.log(user[0].id)

			res.render('dashboard/', {
            
            title: 'User Dashboard',
            title_tag: 'manage your sites and devices',
            user: user[0]
            
        });
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


// upload image
    router.post('/spitbars/upload', function (req, res) {
      console.log('checking upload');


        firebase.initializeApp(app);

// get elements
 var uploader = document.getElementById('uploader');
 var fileButton = document.getElementById('fileButton')

 // listen for file selection
 fileButton.addEventListener('change', function(e){

    // get file
    var file=e.target.files[0];
    // creat storage ref
    var storageRef = firebase.storage().ref('profilepics/' + file.name)
    // upload file
    var task = storageRef.put(file);
 
 
task.on('state_changed', function(snapshot){
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {
              // Handle unsuccessful uploads
            }, function() {
              // Handle successful uploads oncomplete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              var postKey = firebase.database().ref("Posts/").push().key;
              var downloadURL = task.snapshot.downloadURL;
              var updates = {};
              var postData = {
                url: downloadURL,
                // user: user.id

                user: req.session.first_name,
                uid: req.session.fb_user_id
              }

              updates['/Posts'+postKey] = postData;
              firebase.database().ref().update(updates)
              console.log(downloadURL)
            });

 });
        
  //       console.log('check upload')
  //             firebase.auth().onAuthStateChanged(function(user) {
  //             if (user) {
  //               // User is signed in.
  //               var token = firebase.Auth().currentUser.uid
  //               queryDatabase(token);
  //             } else {
  //               // No user is signed in.
  //             }
  //           });

  //   function queryDatabase(token){

  //     firebase.database().ref('/Posts/' + userId).once('value').then(function(snapshot) {
  //     var postArray = snapshot.val().username;
  //     console.log(postArray);
  // // ...
// });


//     }          




});



// router.post('/spitbars/upload', function (req, res, next) {	
			

// var formData = new FormData();
// formData.append("file", ("#file").req.files;
// // formData.append("databaseName", $('#database_name').val().trim());
// // formData.append("tableName", $('#table_name').val().trim());
// // formData.append("delete", $('#delete').prop("checked"));
// var url = window.location.origin + "/spitbars/upload";




// 	console.log(req.files);
// 	res.send(req.files);
// });



module.exports = router;

