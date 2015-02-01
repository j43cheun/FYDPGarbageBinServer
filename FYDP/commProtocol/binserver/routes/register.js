var express = require('express');
var router = express.Router();

/*
 * There are 2 different routes the main server can hit on a trash can.
 * /lastStatus: Returns the last retrieved status. Theoretically this is an instant call.
 * /updateStatus: This updates the status. Returns a {'status':'working'} json object. Eventually when ready, the trash can will hit the server with a POST request
 *  containing the status.
 */

/*
 * GET last known status.
 */
router.get('/laststatus', function(req, res, next) {
    var sampleObject = 
    {
        'Hello': 45,
        'Nope':67
    }
    res.json(sampleObject);
});

router.get('/updatestatus', function(req, res, next) {
    var sampleObject = 
    {
        'status':'working'
    }
    res.json(sampleObject);
});

module.exports = router;
