// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// set up basic variables for app

var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');


// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

var audioCtx = new(window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");



//main block for doing the audio recording

if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');

    var constraints = { audio: true };
    var chunks = [];

    console.log('a' + chunks)

    var onSuccess = function(stream) {
        var mediaRecorder = new MediaRecorder(stream);

        visualize(stream);

        record.onclick = function() {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            record.style.background = "red";

            stop.disabled = false;
            record.disabled = true;
        }

        stop.onclick = function() {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            record.style.background = "";
            record.style.color = "";
            // mediaRecorder.requestData();

            stop.disabled = true;
            record.disabled = false;
        }

        mediaRecorder.onstop = function(e) {
            console.log("data available after MediaRecorder.stop() called.");

            var clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');
            console.log(clipName);
            var clipContainer = document.createElement('article');
            var clipLabel = document.createElement('p');
            var audio = document.createElement('audio');
            var deleteButton = document.createElement('button');

            console.log(audio)

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';

            if (clipName === null) {
                clipLabel.textContent = 'My unnamed clip';
            } else {
                clipLabel.textContent = clipName;
            }

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            audio.controls = true;
            var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });

            console.log(blob)
            chunks = [];
            console.log(chunks)
            var audioURL = window.URL.createObjectURL(blob);
            console.log(audioURL)
            audio.src = audioURL;

            // pacakage for ajax 
            var formData = new FormData()
            formData.append('track', blob, clipLabel.textContent + ".wav");
            console.log(formData)

            // sending to route spitbars/audio
            $.ajax({
                type: "POST",
                url: '/spitbars/audio',
                data: formData,
                name: clipLabel.textContent,
                name: 'tester',
                success: success,
                processData: false,
                contentType: false

            });

            console.log("recorder stopped");


            deleteButton.onclick = function(e) {
                evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            }

            clipLabel.onclick = function() {
                var existingName = clipLabel.textContent;
                var newClipName = prompt('Enter a new name for your sound clip?');
                if (newClipName === null) {
                    clipLabel.textContent = existingName;
                } else {
                    clipLabel.textContent = newClipName;
                }
            }
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

    var onError = function(err) {
        console.log('The following error occured: ' + err);
    }

    navigator.getUserMedia(constraints, onSuccess, onError);
} else {
    console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
    var source = audioCtx.createMediaStreamSource(stream);

    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    WIDTH = canvas.width
    HEIGHT = canvas.height;

    draw()

    function draw() {

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;


        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

    }
}



function postAudio() {

    $.ajax({
        type: "GET",
        url: '/api/audio',
        success: success

    }).done(function(response) {
        console.log(response)

        for (var items in response) {

            if (response[items].recording_path)
                displayMyMusic(response[items]);
        }
    })
}

postAudio();

function displayMyMusic(response) {
    console.log(response)
    var clipName = response.title || "My song";
    //       console.log(clipName)




    var soundClipsSaved = document.querySelector('.sound-clips-saved');

    var clipContainer = document.createElement('article');
    var clipLabel = document.createElement('p');
    var audio = document.createElement('audio');
    var deleteButton = document.createElement('button');
    var likeButton = document.createElement('button')

    clipContainer.classList.add('clip');
    audio.setAttribute('controls', '');
    audio.setAttribute('src', '');
    // deleteButton.textContent = 'Delete';
    // deleteButton.className = 'delete';
    likeButton.textContent = 'Like';
    likeButton.className = 'like';

    clipLabel.textContent = clipName;

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(likeButton);
    soundClipsSaved.appendChild(clipContainer);


    audio.controls = true;
    audio.src = window.location.protocol + '//' + window.location.host + response.recording_path;
    console.log(audio.src)
    deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    }



}


function changeRating(rating) {
var formData = new FormData();    
var formData = { change: rating };

$.ajax({
    type: "POST",
    url: 'spitbars/ratingChange',
    data: formData,
    success: success
        // processData: false,
        // contentType: false

});

}



var amountLikes = 0;
var liked = true;

$(document).ready(function() {
    console.log('hello')
    $(this).on('click', function() {



        if (liked) {
            amountLikes= 1;
            console.log(amountLikes);
            liked = false;
        }else {
            amountLikes= -1;
            console.log(amountLikes)
            liked = true;
        }
         changeRating(amountLikes);
    });
   

}); // end of on click
