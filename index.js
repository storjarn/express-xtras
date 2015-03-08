module.exports = function(app, basePath, config) {
    config = config || {};

    var express = require('express');
    var path = require('path');
    var fs = require('fs');
    var _ = require('underscore');

    var defaultConfig = {
        appName: 'express-xtras',
        basePath: basePath,
        favIcon: 'public/favicon.ico',
        viewPath: 'views',
        publicPath: 'public',
        logger: 'morgan',
        viewEngine: {
            name: 'ejs',
            module: require('ejs-locals')
        }
    };

    var configPath = path.join(basePath, 'config.js');
    if (fs.existsSync(configPath)) {
        var tmpConfig = require(configPath);
        config = _.extend(tmpConfig, config);
    }
    app.config = config = _.extend(defaultConfig, config);

    app.log = (function() {
        var logger = require('./lib/loggers')('util');
        return function() {
            var args = [].slice.call(arguments);
            args.unshift(app.config.appName + ": %j");
            logger.info.apply(null, args);
        };
    })();

    if (typeof config.logger === 'string') {
        config.logger = require('./lib/loggers')(config.logger);
    }
    if (typeof config.viewEngine.module === 'string') {
        config.viewEngine.module = require(config.viewEngine.module);
    }

    var favicon = require('serve-favicon');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    // view engine setup
    app.set('views', path.join(basePath, config.viewPath));
    app.engine(config.viewEngine.name, config.viewEngine.module);
    app.set('view engine', config.viewEngine.name);

    // favicon setup
    var iconPath = path.join(basePath, config.favIcon);
    if (fs.existsSync(iconPath)) {
        app.use(favicon(iconPath));
    }
    // express base middleware setup
    app.use(config.logger);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(basePath, config.publicPath)));

    // express xtras middleware setup
    require('./lib/init')(app, basePath);
};
