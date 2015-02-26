var typeMap = {
    'BIN_ID':parseInt,
    'PORT':parseInt
};

//A helper function that helps parse an environment variable 
//or some other value. EXAMPLE: var port = process.env.PORT || 3000,
//but this will try do a cast on the variable to make sure it comes out
//as defined in typeMap.
//Called supposedValue because it could be undefined.
var choseValueOrDefault = function(key, supposedValue, defaultValue){
    if (supposedValue === undefined || supposedValue === null){
        return defaultValue;
    }
    if (typeMap.hasOwnProperty(key)){
        return typeMap[key](supposedValue);
    }
    return supposedValue;
};

//A helper that is similar to choseValueOrDefault, but this just does a cast.
var castValueIfNeeded = function(key, valueToCast){
    if (typeMap.hasOwnProperty(key)){
        return typeMap[key](valueToCast);
    }
    //We don't have a chosen cast, so we just return
    //the value as is (likely a string).
    return valueToCast;
}

//This utility parses the command line parameters (if any)
//and returns an object containing the port and server
//If an environment variable is set, that is used, but only
//if there isn't already a command line option specified.
//Priorities: Command Line -> Env Variable -> Defaults
//Note that these names for the defaults are also what is expected in an invironment
//variable. So, an environmental variable for hostname needs to be called HOST_NAME.
//Note later parameters on the command line overtake earlier ones.
var Parameters = {
    'BIN_ID': choseValueOrDefault(process.env.BIN_ID,23967),
    'HOST_NAME': choseValueOrDefault(process.env.HOST_NAME, 'localhost'), 
    'PORT': choseValueOrDefault(process.env.PORT, 3000), 
    'CENTRAL_HOST_NAME': choseValueOrDefault(process.env.CENTRAL_HOST_NAME, 'localhost'),
    'CENTRAL_PORT': choseValueOrDefault(process.env.CENTRAL_PORT, 8080)
};

//Command Line format:
//argument=value argument2=value2

function parseException(message, cmdArgs, index){
    this.message = message;
    this.cmdArgs = cmdArgs;
    this.index = index;
};

var parse = function(){
    //If we have no arguments whatsoever, we just return the defaults.
    if (process.argv.length < 3)
    {
        return Parameters;
    }
    
    var subCMDArray = process.argv.slice(2, process.argv.length)
    
    //Making a copy of an object in JS is annoying, so we just modify the original.
    //Reference: http://stackoverflow.com/a/4351548
    subCMDArray.forEach(function(val, index, array){
        //Do a split.
        var valueArgumentPair = val.split("=");
        //If the length is not 2, then we have a problem.
        if (valueArgumentPair.length != 2){
            throw new parseException(val + " not formatted correctly. Should be argument=value", array, index);
        };
        var key = valueArgumentPair[0].toUpperCase();
        Parameters[key] = castValueIfNeeded(key,valueArgumentPair[1]);
    });
    return Parameters;
};

module.exports = {'parse':parse, 'parameters':Parameters};
