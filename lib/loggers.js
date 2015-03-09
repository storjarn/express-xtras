var _ = require('underscore');

module.exports = function(logger, logName) {
    var loggers = {
        'morgan': function(type) {
            // https://github.com/expressjs/morgan
            return require('morgan')(type || 'dev');
        },
        'bunyan-express': function(options) {
            // https://github.com/villadora/express-bunyan-logger
            return require('express-bunyan-logger').logger(_.extend({
                name: 'dev',
                streams: [{
                    level: 'info',
                    stream: process.stdout // log INFO and above to stdout
                }, {
                    level: 'error',
                    path: './error.log' // log ERROR and above to a file
                }]
            }, options || {}));
        },
        'bunyan': function(options) {
            return require('bunyan').createLogger(_.extend({
                name: 'dev',
                streams: [{
                //     level: 'info',
                //     stream: process.stdout // log INFO and above to stdout
                // }, {
                    level: 'error',
                    path: './error.log' // log ERROR and above to a file
                }]
            }, options || {}));
        },
        'npm': function() {
            // https://github.com/npm/npmlog
            return require('npmlog');
        },
        'util': function(section) {
            var util = require('util');

            function log() {
                var msg = '';
                if (arguments.length > 1 && typeof arguments[0] === 'string') {
                    msg = util.format.apply(null, arguments);
                } else {
                    msg = [].slice.call(arguments);
                }
                util.log(util.inspect(msg, {
                    showHidden: false,
                    depth: null,
                    colors: true
                }));
            }

            var info = function() {
                var args = [].slice.call(arguments);
                args.unshift(section + ": %j");
                log.apply(null, args);
            };

            return {
                info: info,
                debug: function() {
                    var debuglog = util.debuglog(section);
                    debuglog.apply(null, arguments);
                }
            };
        }
    };
    return loggers[logger || 'morgan'](logName);
};
