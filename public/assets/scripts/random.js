var topics = ['Cars', "Diss Track: You're So Broke", "My Crew", "Where your from","Diss Track: You're So Wack", 'Being the Greatest', 'Confidece', 'Growing Up', 'Family', 'Love', 'The Streets', 'Political Influence'];

var topic = topics[Math.floor(Math.random()*topics.length)];

console.log(topic)

function myFunction() {
    document.getElementById("topic").innerHTML = topic;
}

myFunction();