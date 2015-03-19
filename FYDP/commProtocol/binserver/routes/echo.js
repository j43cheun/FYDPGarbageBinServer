//Little thing that echos exactly what gets sent to it.
var express = require('express');
var router = express.Router();

router.post('/console', function(req, res, next) {
    console.log(req.body.stdout);
    res.json({"status":"working"});
});

module.exports = router;