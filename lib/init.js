module.exports = function(app, basePath) {

    var Path = require('path');

    app.use(function(req, res, next) {
        req.startTime = new Date().getTime();
        next();
    });

    /* Middleware and utilities*/
    require('./utility')(app, basePath);

    //Stats
    if (!App.Stats) {
        app.log("Initializing App.Stats");
        App.Stats = {
            // "cache" : {
            //  "numberOfObjects" : 0
            // },
            "id": require('os').hostname() + '_' + new Date().getTime().toString(36),
            "memoryConsumption": process.memoryUsage(),
            // "peers"             : [],
            // "queue"             : {
            //     "queueLength"   : 0,
            //     "sleepingTasks" : []
            // },
            // "socketServer"      : {
            //     "numberOfGlobalSocketRequests"     : 0,
            //     "numberOfLocalActiveSocketClients" : 0,
            //     "numberOfLocalSocketRequests"      : 0
            // },
            "startTime": new Date().getTime(),
            "uptimeSeconds": 0,
            "webServer": {
                "numberOfGlobalWebRequests": 0,
                "numberOfLocalWebRequests": 0
            },
            // "webSocketServer"   : {
            //     "numberOfGlobalWebSocketRequests"     : 0,
            //     "numberOfLocalActiveWebSocketClients" : 0
            // },
            // "requests"          : {}
        };

        setInterval(function() {
            App.Stats.uptimeSeconds = (new Date().getTime() - App.Stats.startTime) / 1000;
            App.Stats.memoryConsumption = process.memoryUsage();
        }, 1000);
    }

    app.use(function(req, res, next) {
        ++App.Stats.webServer.numberOfGlobalWebRequests;
        if (['127.0.0.1', 'localhost'].indexOf(req.ip) > -1) {
            ++App.Stats.webServer.numberOfLocalWebRequests;
        }
        next();
    });

    /* Routes */
    require('node-dir').files(Path.join(basePath, 'routes'), function(err, files) {
        // console.log(files);
        for(var i = 0; i < files.length; ++i) {
            require(files[i])(app);
        }

        app.servers = {};

        app.servers.webSocket = require('../bin/ws');

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
    });
};
