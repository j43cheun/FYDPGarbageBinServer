var express = require('express');
var request = require('request');
var router = express.Router();

var doRegistration = function(runTimeParameters) {
    var registrationObject = {'binID' : runTimeParameters.BIN_ID, 'ip' : runTimeParameters.HOST_NAME, 'port':runTimeParameters.PORT};
    var url = "http://" + runTimeParameters.CENTRAL_HOST_NAME + ":" + runTimeParameters.CENTRAL_PORT +  "/GarbageBinServer/GarbageBinRegistrationServlet";
    request.post(
    url,
    { json : registrationObject }, 
    function (error, response, body) {
        if (error){
            console.log("Error registering garbage bin.: ");
            console.log(error);
        }
        else{
            console.log("Registered Successfully");
        } 
    });
};

var register = {
    'doRegistration' : doRegistration
};

module.exports = register;
