var Class = require('ee-class/dist/Class.min');
var EventEmitter = require('ee-class/dist/EventEmitter.min');
var _ = require('underscore');

var Controller = new Class({
    inherits: EventEmitter,
    init: function() {

    },
    extend: function(obj) {
        var ret = _.extend({}, this);
        ret = _.extend(ret, obj);
        return ret;
    },
    _: _,

    generators: {
        fail: function(next) {
            return function(err) {
                err.status = 500;
                console.error(err);
                next(err);
            };
        }
    }
});

module.exports = new Controller();
