//Reference: http://www.graemeboy.com/node-child-processes
var spawn = require('child_process').spawn;

//This will be a constant used for all the node processes that get started.
var commandStringConstant = "bin/www HOST_NAME=localhost CENTRAL_HOST_NAME=localhost CENTRAL_PORT=8080 ";

//The starting port number. We will just increment from here on out.
var startingPort = 3000;

//The starting bin id.
var startingBinID = 1;

//The number of children we plan on creating.
var numberOfProcesses = 20;

var currentBinId = startingBinID;

for (var i = 0; i < numberOfProcesses; i++){
    var currentBinId = startingBinID + i;
    var currentPort = startingPort + i;
    var command = commandStringConstant + "BIN_ID="+currentBinId + " port="+currentPort;
    
    //command = "python testCommandLine.py"
    var child = spawn('node', command.split(" "));
    child.on('error', function( err ) {throw err});
    child.stdout.on('data', function(data) {
        console.log(" " + data);
    });
    child.on('exit', function(exitCode) {
        console.log("Process with bin id " + currentBinId + " exited.");
    });
    
};