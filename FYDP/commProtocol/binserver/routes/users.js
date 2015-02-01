var express = require('express');
var router = express.Router();


/*
 * GET userlist.
 */
router.get('/userlist', function(req, res, next) {
    var sampleObject = 
    {
        'Hello': 45,
        'Nope':67
    }
    res.json(sampleObject);
});

module.exports = router;
