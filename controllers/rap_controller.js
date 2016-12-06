var express = require('express');
var router = express.Router();
var path = require('path');

var rap = require('../models/rap.js');
var firebase = require('firebase');
var multer = require('multer');
var uploadFolder = path.resolve(__dirname, "../public/tracks_folder");
var FormData = require('form-data');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var app = firebase.initializeApp({
    apiKey: "AIzaSyB-FKM1CKZpjJPzlfIk6xT4afP6ZGQ_KgM",
    authDomain: "spit-bars.firebaseapp.com",
    databaseURL: "https://spit-bars.firebaseio.com",
    storageBucket: "spit-bars.appspot.com",
    messagingSenderId: "810792566820"
});



// routes

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/recorder', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/dashboard/recorder.html'));
});

router.get('/recordings', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/dashboard/recordings.html'));
});

router.get("/signup", function(req, res) {
    // res.sendfile(__dirname + "../public/signup.html");
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get("/dashboard", function(req, res) {
    // res.sendfile(__dirname + "../public/signup.html");
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});


router.get("/reset", function(req, res) {
    // res.sendfile(__dirname + "../public/signup.html");
    res.sendFile(path.join(__dirname, '../public/email.html'));
});



function validTrackFormat(trackMimeType) {
    // we could possibly accept other mimetypes...
    var mimetypes = ["audio/mp3", 'audio/ogg'];
    return mimetypes.indexOf(trackMimeType) > -1;
}

function trackFileFilter(req, file, cb) {
    cb(null, validTrackFormat(file.mimetype));
}

var trackStorage = multer.diskStorage({
    // used to determine within which folder the uploaded files should be stored.
    destination: function(req, file, callback) {

        callback(null, uploadFolder);
    },

    filename: function(req, file, callback) {
        // req.body.name should contain the name of track

        callback(null, file.originalname);
        // callback(null, file.fieldname + '-' + Date.now());
    }
});


var upload = multer({
    storage: trackStorage
        // fileFilter: trackFileFilter
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

        var colName = ['firstname', 'lastname', 'email', 'month', 'day', 'year', 'uid'];
        var colVal = [newFirstName, newLastName, newUserEmail, newUserDOBmonth, newUserDOBday, newUserDOByear, uid];

        rap.insertInto('users', colName, colVal, function(data) {
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
        var colVal = [email];
        // var colVal = [newUserName, newUserEmail, newUserType];
        console.log('calling db')

        rap.selectFrom('users', colName, colVal, function(user) {
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

    return email;

});

// saves audio to mysql
router.post('/spitbars/audio', upload.single("track"), function(req, res) {
    console.log("Uploaded file: ", req.file); //audio that was uploaded.


    var recordingTitle = req.file.originalname;
    var newAudioPath = __dirname + "/uploads/" + req.file.originalname + ".wav";

    console.log(email);
    console.log(recordingTitle)
    console.log(newAudioPath)

    var colName = ['email', 'title', 'recording'];
    var colVal = [email, recordingTitle, newAudioPath];

    rap.insertInto('recordings', colName, colVal, function(data) {
        res.redirect('/dashboard')
    });


});

// retrieves audio from MySQL
router.post('/spitbars/recordings', upload.single("track"), function(req, res) {
    

    var colName = ['email'];
    var colVal = [email];

  rap.selectFrom('recordings', colName, colVal, function(user) {
        
    });


});









// upload image
router.post('/spitbars/upload ', function(req, res) {

    // console.log(req.body)

    console.log('check upload')
        //   firebase.auth().onAuthStateChanged(function(user) {
        //   if (user) {
        //     // User is signed in.
        //     console.log('signed in')
        //     var token = firebase.Auth().currentUser.uid
        //     console.log(token)

    //   } else {
    //     // No user is signed in.
    //   }
    // });

    function queryDatabase(email) {

        firebase.database().ref('/Posts/' + email).once('value').then(function(snapshot) {
            var postArray = snapshot.val();
            console.log('post array')
            console.log(postArray);
        });

    }
    console.log(req.session.user_email)
    queryDatabase(req.session.user_email);


});







module.exports = router;
