module.exports = exports = function type_extension_Plugin(schema, options) {
    var _ = require('underscore');
    var async = require('async');
    var mongoose = require('mongoose');
    var Path = require('path');

    options = _.extend({
        pluginsPath: 'models/plugins',
        customEvents: {}
    }, options || {});

    schema.statics.plugins = [];
    schema.statics.loadPlugins = function() {
        schema.statics.plugins = [];
        var pluginsPath = Path.resolve(options.pluginsPath);
        require('node-dir').files(pluginsPath, function(err, files) {
            for (var i = 0; i < files.length; ++i) {
                // console.log(files[i]);
                schema.statics.plugins.push(require(files[i]));
            }
        });
    };

    if (!schema.paths.type) {
        schema.add({
            type: {
                type: String,
                required: true
            }
        });
    }

    if (!schema.paths.extras) {
        schema.add({
            extras: {
                type: mongoose.Schema.Types.Mixed
            }
        });
    }

    var eventNames = ['init', 'validate', 'save', 'remove', 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'];

    function asyncDone(next) {
        return function(err, results) {
            if (err) {
                console.error(err);
            }
            if (results.length) {
                // console.log(results);
            }
            if (next) {
                next();
            }
        };
    }
    eventNames.forEach(function(eventName) {
        schema.pre(eventName, function(next) {
            var plugins = findPluginsByType('pre', eventName);
            var funcs = [];
            plugins.forEach(function(plugin) {
                funcs.push(function(callback) {
                    plugin.run({
                        eventName: 'pre.' + eventName,
                        next: callback
                    });
                });
            });
            async.series(funcs, asyncDone(next));
        });
        schema.post(eventName, function(data) {
            var plugins = findPluginsByType('post', eventName, data.type);
            var funcs = [];
            plugins.forEach(function(plugin) {
                funcs.push(function(callback) {
                    plugin.run({
                        eventName: 'post.' + eventName,
                        next: callback,
                        data: data
                    });
                });
            });
            async.series(funcs, asyncDone());
        });
    });
    for(var eventName in (options.customEvents || {})) {
        schema.on(eventName, options.customEvents[eventName]);
    }
    //-------------------------------------------
    function findPluginsByType(preOrPost, eventType, documentType) {
        var ret = [];
        schema.statics.plugins.forEach(function(plugin) {
            if (plugin.events.indexOf(preOrPost + '.' + eventType) > -1) {
                if (!documentType || (documentType && plugin.types.indexOf(documentType) > -1)) {
                    ret.push(plugin);
                }
            }
        });
        ret.sort(function(a, b) {
            return (a.order - b.order);
        });
        return ret;
    }

    schema.statics.loadPlugins();
};
