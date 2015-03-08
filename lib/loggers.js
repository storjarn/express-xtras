module.exports = function(logger) {
    var loggers = {
        'morgan': function(type) {
            return require('morgan')(type || 'dev');
        },
        'bunyan-express': function() {
            return require('express-bunyan-logger').logger({
                name: 'dev',
                streams: [{
                    level: 'info',
                    stream: process.stdout // log INFO and above to stdout
                }, {
                    level: 'error',
                    path: './error.log' // log ERROR and above to a file
                }]
            });
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
                util.log(util.inspect(msg, { showHidden: false, depth: null, colors: true }));
            }

            return {
                info: function() {
                    log.apply(null, arguments);
                },
                debug: function() {
                    var debuglog = util.debuglog(section);
                    debuglog.apply(null, arguments);
                }
            };
        }
    };
    return loggers[logger || 'morgan']();
};