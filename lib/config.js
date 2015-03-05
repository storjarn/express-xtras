module.exports = function(app) {

    app.use(function (req, res, next) {
        req.startTime = new Date().getTime();
        next();
    });

    /* Middleware and utilities*/
    require('./utility')(app);

    //Stats
    if (!App.Stats) {
        console.log("Initializing App.Stats");
        App.Stats = {
            // "cache" : {
            //  "numberOfObjects" : 0
            // },
            "id"                : require('os').hostname() + '_' + new Date().getTime().toString(36),
            "memoryConsumption" : process.memoryUsage(),
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
            "startTime"     : new Date().getTime(),
            "uptimeSeconds"     : 0,
            "webServer"         : {
                "numberOfGlobalWebRequests" : 0,
                "numberOfLocalWebRequests"  : 0
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

    app.use(function (req, res, next) {
        ++App.Stats.webServer.numberOfGlobalWebRequests;
        if (['127.0.0.1', 'localhost'].indexOf(req.ip) > -1) {
            ++App.Stats.webServer.numberOfLocalWebRequests;
        }
        next();
    });

    /* Routes */
    require('./routes/index')(app);
    require('./routes/utility')(app);
    require('./routes/jobs')(app);

    require('./bin/ws');

};
