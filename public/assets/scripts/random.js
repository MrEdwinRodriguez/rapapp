var topics = ['Cars', "Diss Track: You're So Broke", "My Crew", "Where your from","Diss Track: You're So Wack", 'Being the Greatest', 'Confidece', 'Growing Up', 'Family', 'Love', 'The Streets', 'Political Influence'];

var topic = topics[Math.floor(Math.random()*topics.length)];

console.log(topic)

function myFunction() {
    document.getElementById("topic").innerHTML = topic;
}

myFunction();

$(document).ready(function() {
    console.log('hello')
    var currentUser = 'test';
    // $('.like').on('click', function() {

    //     var amountLikes = 0;
    //     console.log(amountLikes)
    //     amountLikes++;
    //     console.log(amountLikes)
    //     console.log('clicked')

    $("button").click(function(){
        alert("The paragraph was clicked.");
    
    });
}); // end of on click