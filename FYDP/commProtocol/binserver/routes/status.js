var express = require('express');
var request = require('request');
var router = express.Router();

/*
 * There are 2 different routes the main server can hit on a trash can to get its status.
 * /lastStatus: Returns the last retrieved status. Theoretically this is an instant call.
 * /updateStatus: This updates the status. Returns a {'status':'working'} json object. Eventually when ready, the trash can will hit the server with a POST request
 *  containing the status.
 */

var sampleJSON = {
    'binID':232,
    'capacity': 30.4,
    'battery': 75.67,
    'location':{
        'latitude':78.78,
        'longitude':98.98
    },
    'ip':'localhost',
    'port':3000
}
 
var someNum = 65;

var async = function(data, callback){
    var timeout = Math.ceil(Math.random() * 3000)
    console.log("Timeout set for: ");
    console.log(timeout)
    setTimeout(function() {
        callback(null, data);
        }, timeout);
};

var doPost = function(data) {
    request.post(
    'http://localhost:8080/GarbageBinServer/GarbageBinServlet',
    { json : sampleJSON }, 
    function (error, response, body) {
        console.log("Done post");
        if (error){
            console.log("Error: ");
            console.log(error);
        }
        else{
            console.log(body);
            //console.log(response);
        } 
    });
};
 
/*
 * GET last known status.
 */
router.get('/laststatus', function(req, res, next) {
    res.json(sampleJSON);
});

router.get('/updatestatus', function(req, res, next) {
    var sampleObject = {
        'status':'working'
    };
    async(1, function(err, data){
        someNum  = Math.random() * 3000;
        console.log("someNum set to ");
        console.log(someNum );
    });
    res.json(sampleObject);
});

/*
 * When a post request for updating the status is received, the trash
 * can tries to update itself. It will then post this status to the server.
 */
router.post('/updatestatusPost', function(req, res, next) {
        async(1, function(err, data){
        sampleJSON.capacity = Math.random() * 100;
        someNum  = Math.random() * 3000;
        console.log("someNum set to ");
        console.log(someNum );
        doPost(someNum);
    });
    res.send("Done");
});

module.exports = router;
