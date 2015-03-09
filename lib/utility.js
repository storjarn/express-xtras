module.exports = function(app, basePath) {
    var Path = require('path');

    var pkg = require(Path.join(basePath, 'package.json'));

    if (pkg.appName) {
        app.locals.siteName = app.config.appName = pkg.appName;
    }
    App = app.locals;

    App._ = require('underscore');

    function generateResponseData() {
        return {
            "requestorInformation": {
                "receivedParams": {}, //array_merge($this->request->get(), $this->request->post(), $this->request->put()),
                "remoteAddress": '', //$this->request->getIp()
            },
            "serverInformation": {
                "apiVersion": "1.0.0",
                "currentTime": new Date().getTime(),
                "requestDuration": 0,
                "serverName": App.siteName,
                "hostName": require('os').hostname(),
                "protocol": 'http'
            }
        };
    }

    App.prepareResponse = function(data, req, res) {
        data = data || {};
        data = App._.extend(res.Data || generateResponseData(), data);

        // data.serverInformation.requestDuration = new Date().getTime() - res.Data.serverInformation.currentTime;
        data.serverInformation.requestDuration = new Date().getTime() - req.startTime;
        data.serverInformation.protocol = req.protocol;
        data.serverInformation.path = Path.join(req.baseUrl || '', req.path || '');
        data.serverInformation.secure = req.secure;
        data.serverInformation.xhr = req.xhr;

        data.requestorInformation.remoteAddress = req.ip;
        data.requestorInformation.receivedParams = App._.extend(req.params, req.query);

        return data;
    };

    App.pageData = function(data, req, res) {
        var meta = generateResponseData();
        meta.pageTitle = App.siteName;
        data = App._.extend(meta, data || {});
        if (!!req && !!res) {
            data = App.prepareResponse(data, req, res);
        }
        return data;
    };

    app.log("Using request data middleware");
    app.log("Using request end middleware");
    app.use(function(req, res, next) {

        //Request augmentation
        res.Data = generateResponseData();

        var realEnd = res.end;
        res.end = function() {
            // App.Menu = null;
            realEnd.apply(res, arguments);
        };
        var realSend = res.send;
        res.send = function(data) {
            if (typeof data == "object") {
                data = App.prepareResponse(data, req, res);
            }
            realSend.call(res, data);
        };
        next();
    });

    // Init menu object
    app.log("Using active menu middleware");
    var ActiveMenu = require('active-menu');
    var mainMenu = new ActiveMenu('mainMenu');
    mainMenu.setAttributes({
        class: 'menu',
        id: 'main-menu'
    });
    // Set on App to use in routes and whatnot
    App.Menu = mainMenu;
    app.use(mainMenu.menu);

    // Init database
    if (app.config.db) {
        app.log("Setting up database connection(s)");
        App.db = require('./db')(app, basePath);
    }
};
