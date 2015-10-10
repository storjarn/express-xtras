module.exports = function(app) {
    var config = app.get('config');
    var basePath = config.basePath;

    global.loadApp = function() {
        return app;
    };

    var utils = app.get('utils');
    var pkg = require(utils.Path.join(basePath, 'package.json'));
    app.set('pkg', pkg);

    require('./session')(app);
    require('./auth')(app);
    require('./flash')(app);
    require('./cache')(app);

    app.use(function(req, res, next) {
        req.startTime = new Date().getTime();
        next();
    });

    require('./locals')(app);
    require('./apis')(app);
    require('./routes')(app);

    require('./response')(app);
    require('./menu')(app);

    // Init database
    if (app.get('config').db) {
        require('./db')(app);
    }

    //Stats
    if (!app.get('Stats')) {
        app.log("Initializing app Stats");

        var getCPUUsage = function() {
            var ret = {};
            var os = require("os"),
                cpus = os.cpus();
            for(var i = 0, len = cpus.length; i < len; i++) {
                // console.log("CPU %s:", i);
                var cpu = cpus[i], total = 0;
                var type = '';
                for(type in cpu.times)
                    total += cpu.times[type];

                for(type in cpu.times) {
                    ret[type] = parseFloat((100 * cpu.times[type] / total).toFixed(2));
                    // console.log("\t", type, Math.round(100 * cpu.times[type] / total));
                }
            }
            return ret;
        };

        app.set('Stats', {
            // "cache" : {
            //  "numberOfObjects" : 0
            // },
            "id": require('os').hostname() + '_' + new Date().getTime().toString(36),
            "memoryConsumption": process.memoryUsage(),
            "cpuAverage": require('os').loadavg(),
            "cpuUsage": getCPUUsage(),
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
        });

        setInterval(function() {
            app.get('Stats').uptimeSeconds = (new Date().getTime() - app.get('Stats').startTime) / 1000;
            app.get('Stats').memoryConsumption = process.memoryUsage();
            app.get('Stats').cpuAverage = require('os').loadavg();
            app.get('Stats').cpuUsage = getCPUUsage();
        }, 1000);
    }

    app.use(function(req, res, next) {
        ++(app.get('Stats').webServer.numberOfGlobalWebRequests);
        if (['127.0.0.1', 'localhost'].indexOf(req.ip) > -1) {
            ++(app.get('Stats').webServer.numberOfLocalWebRequests);
        }
        next();
    });

    app.use(require('compression')({
        level: 6
    }));

    /* Routes */
    require('node-dir').files(utils.Path.join(basePath, 'models'), function(err, files) {
        for (var i = 0; i < files.length; ++i) {
            // console.log(files[i]);
            require(files[i]);
        }

        require('node-dir').files(utils.Path.join(basePath, 'routes'), function(err, files) {
            for (var i = 0; i < files.length; ++i) {
                // console.log(files[i]);
                require(files[i])(app);
            }

            app.servers = {};

            app.servers.webSocket = require('../bin/ws');

            // error handlers

            //Watch for 403 forbidden status
            app.use(function(err, req, res, next) {
                if (err.status === 403) {
                    if (req.xhr) {
                        res.send({
                            message: err.message,
                            error: err
                        });
                    } else {
                        res.render('login', {
                            message: err.message,
                            error: err
                        });
                    }
                } else {
                    next(err);
                }
            });

            // catch 404 and forward to error handler
            app.use(function(req, res, next) {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
            });

            // development error handler
            // will print stacktrace
            if (app.get('env') === 'development') {
                app.use(function(err, req, res, next) {
                    err.status = err.status || 500;
                    res.status(err.status || 500);
                    if (req.xhr) {
                        res.send({
                            message: err.message,
                            error: err
                        });
                    } else {
                        res.render('error', {
                            message: err.message,
                            error: err
                        });
                    }
                });
            }

            // production error handler
            // no stacktraces leaked to user
            app.use(function(err, req, res, next) {
                err.status = err.status || 500;
                res.status(err.status);
                var msg = err.message;
                if (err.status === 500) {
                    msg = "Internal Server Error";
                }
                if (req.xhr) {
                    res.send({
                        message: msg,
                        error: {
                            status: err.status,
                            stack: ''
                        }
                    });
                } else {
                    res.render('error', {
                        message: msg,
                        error: {
                            status: err.status,
                            stack: ''
                        }
                    });
                }
            });
        });
    });
};
