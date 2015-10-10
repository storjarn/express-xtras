module.exports = function(app, basePath, config) {
    config = config || {};
    var express = require('express');

    /*
    ---------------------------------
        Utilities
    ---------------------------------
    */
    app.set('utils', {
        fs: require('fs'),
        Path: require('path'),
        _: require('underscore'),
        crypto: require('./lib/crypto-xtras'),
        request: require('request'),
        async: require('async')
    });
    var utils = app.get('utils');

    /*
    ---------------------------------
        Config
    ---------------------------------
    */
    require('./config')(app, basePath, config);
    config = app.get('config');

    /*
    ---------------------------------
        Logging
    ---------------------------------
    */
    app.loggers = require('./lib/loggers');
    app.log = app.loggers('util', config.appName).info;

    if (typeof config.logger === 'string') {
        config.logger = app.loggers(config.logger);
    }
    if (typeof config.viewEngine.module === 'string') {
        config.viewEngine.module = require(config.viewEngine.module);
    }

    /*
    ---------------------------------
        View engine
    ---------------------------------
    */
    require('./lib/view')(app);

    /*
    ---------------------------------
        Standard middleware
    ---------------------------------
    */
    var favicon = require('serve-favicon');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    // favicon setup
    var iconPath = utils.Path.join(basePath, config.favIcon);
    if (utils.fs.existsSync(iconPath)) {
        app.use(favicon(iconPath));
    }
    // express base middleware setup
    app.use(config.logger);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(utils.Path.join(basePath, config.publicPath)));

    /*
    ---------------------------------
        Xtras middleware
    ---------------------------------
    */
    require('./lib/init')(app);
};
