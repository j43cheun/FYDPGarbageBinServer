//This files provides identity information/server fields and utilities for a given 
//garbage bin.

var statusEnum = {
    'OKAY':'okay',
    'BUSY':'busy',
    'DOWN':'down'
};

// A list that identifies each central server.
// Each entry is a an object with a specified host name and
// a port as well as a status field.
var centralServerList = []; 
var chosenServer;

// Includes the bin ID, the bin IP and the bin port as well as a central server
// and information on it.
var networkParams = {};

// Includes everything. Theoretically we could have other command line arguments.
// We store them all here.
var allParameters = {};

// Returns the parameters of the bin and the central system it connects to.
var getNetworkParams = function(){
    var params = {
        'BIN_ID': networkParams.BIN_ID,
        'HOST_NAME': networkParams.HOST_NAME, 
        'PORT': networkParams.PORT, 
        'CENTRAL_HOST_NAME': networkParams.CENTRAL_HOST_NAME,
        'CENTRAL_PORT': networkParams.CENTRAL_PORT
    };
    return params;
};

// This is called with the object returned by serverCommandLineParser.
// This allows us to parse 
var setParams = function(params){
    networkParams = {
        'BIN_ID': params.BIN_ID,
        'HOST_NAME': params.HOST_NAME, 
        'PORT': params.PORT, 
        'CENTRAL_HOST_NAME': params.CENTRAL_HOST_NAME,
        'CENTRAL_PORT': params.CENTRAL_PORT
    };
    
    // Stolen from http://stackoverflow.com/a/14379304
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            allParameters[key] = params[key];
        };
    };
    
    //We assume the first call is made with an empty server list. /shrug. In theory, we could add more servers
    //and check if any go down, but that is additional logic for somewhere down the line if even.
    var serverObject =  { 'CENTRAL_HOST_NAME': params.CENTRAL_HOST_NAME, 'CENTRAL_PORT': params.CENTRAL_PORT, 'STATUS':statusEnum.OKAY};
    centralServerList.push( serverObject );
    
};

var getAll = function(){return allParameters};

module.exports = {'set':setParams, 'get':getNetworkParams, 'getAll':getAll};