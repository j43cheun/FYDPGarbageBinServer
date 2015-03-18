var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var status = require('./routes/status');
var parser = require('./helpers/serverCommandLineParser');
var runtimeParms = require('./helpers/runtimeParameters');

var app = express();

/*
Sample start command:
node bin/www central_host_name=10.22.0.187 central_port=8080 host_name=10.22.0.186 port=6780
central_host_name is the ip of the central tomcat server.
central_port is the port of the tomcat server.
host_name is the host name of the pi this server is running atop.
port is the port of the pi this server is running atop.
*/

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/status', status);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//We get our server parameters.
//We require a port and a host for ourselves and our lovely central server.
var serverParms = parser.parse();
runtimeParms.set(serverParms);

//We register with the server...
var register = require('./routes/register');
register.doRegistration(serverParms);
console.log(serverParms);

app.listen(serverParms.PORT, serverParms.HOST_NAME);

module.exports = app;
