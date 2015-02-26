var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var sem = require('semaphore')(1);

/*
Flow: The function is called which executes a background command line
call. Once the background call is over, the callback function
performs a post call that hits the server.
This function takes care of one important detail in that it handles
the semaphore required for the background call. For simplicity, only
one semaphore is ever used, so all command line calls made through
this function will block one another.
Note: CLC stands for CommandLine Call.
callback needs to be a function that accepts 3 parameters.
(error, stdout, stderr).
*/
var CLC = function(command, callback){
    //We grab a semaphore.
    sem.take(function()
    {
        exec(command, function(err, stdout, stderr){
            //We let go of the semaphore once the out of process
            //call completes.
            sem.leave();
            //We then do the callback that CLC was called with.
            callback(err, stdout, stderr);
        });
    });
}
module.exports = CLC;
