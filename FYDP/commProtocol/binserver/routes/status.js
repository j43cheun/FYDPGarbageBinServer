var express = require('express');
var request = require('request');
var router = express.Router();
var external = require('../helpers/external'); //Our own object for making CMD calls.
var parms = require('../helpers/runtimeParameters');

/*
 * There are 2 different routes the main server can hit on a trash can to get its status.
 * /lastStatus: Returns the last retrieved status. Theoretically this is an instant call.
 * /updateStatus: This updates the status. Returns a {'status':'working'} json object. Eventually when ready, the trash can will hit the server with a POST request
 *  containing the status.
 */

// Just a default object to start of with.
var lastKnownStatus = {
    'capacity': 30.4,
    'battery': 75.67,
    'location':{
        'latitude':78.78,
        'longitude':98.98
    },
    'timestamp' : new Date()
};

// This helper function adds the static part to the JSON being sent
// that is to say the binID, the ip and the port.
var formatIdentity = function(dataToSend) {
    var ourParameters = parms.get();
    dataToSend.binID = ourParameters.BIN_ID;
    dataToSend.ip = ourParameters.HOST_NAME;
    dataToSend.port = ourParameters.PORT;
    return dataToSend;
};

// This returns the url to send to.
// It adds in the methodToCall at the end of it.
var getURLToSendTo = function(methodToCall) {
    var nwParameters = parms.get();
    var url = "http://" + nwParameters.CENTRAL_HOST_NAME + ":" + nwParameters.CENTRAL_PORT +  "/GarbageBinServer/" + methodToCall;
    return url;
};
 
var doPost = function(data) {
    request.post(
    getURLToSendTo('GarbageBinServlet'),
    { json : data }, 
    function (error, response, body) {
        if (error){
            console.log("Error when sending to " + getURLToSendTo('GarbageBinServlet'));
            console.log(error);
        }
        else{
            console.log("Successfully sent a POST request.");
            console.log(body);
        } 
    });
};
 
/*
 * GET last known status.
 */
router.get('/laststatus', function(req, res, next) {
    formatIdentity(lastKnownStatus);
    res.json(lastKnownStatus);
});

/*
 * When a post request for updating the status is received, the trash
 * can tries to update itself. It will then post this status to the server.
 */
router.post('/updatestatusPost', function(req, res, next) {
    //This is an async out of process call.
    external('sudo ./uart3', function(err, stdout, stderr){
        //This function should take in what stdout prints out and
        //format it into a valid JavaScript object that can be POSTED
        //to the central system.
        if (err)
        {
            console.log(err);
            doPost(formatError(err)); //If we had an error doing the CMD call, we let the server know.
        }
        console.log(stdout);
        parmList = stdout.trim().split(',');
        //TODO: CHANGE THIS ACCORDING TO JUSTIN'S FORMAT.
        objectToSend = {
            'location':{
                'latitude':79.87,
                'longitude':65.78
                //'latitude':parseFloat(parmList[3].trim()),
                //'longitude':parseFloat(parmList[4].trim())
            },
            'battery': parseFloat("99.9"),
            'current_depth':parseFloat(parmList[1].trim()),
            'max_depth':31.999, //Volume in centimeters.
            'timestamp':new Date()
        }
        doPost(formatIdentity(objectToSend));
        lastKnownStatus = objectToSend;
    });
    res.json({"status":"working"});
});

var formatError = function(err){
    var returnObject = {
        'error':err
    };
    formatIdentity(returnObject);
    return returnObject;
}

module.exports = router;
