/*jshint laxbreak : true */
var Class = require('ee-class/dist/Class.min');
var EventEmitter = require('ee-class/dist/EventEmitter.min');
var ws = require("nodejs-websocket");
var _ = require('underscore');

var WebSocketServer = new Class({
    // inherits: EventEmitter,

    init: function constructor(options) {
        var self = this;
        options = options || {};
        // constructor.super.call(self);
        self.port = options.port || 3001;
        if (options.events) {
            for (var key in options.events) {
                for (var i = 0; i < options.events[key].length; ++i) {
                    self.events[key].push(options.events[key][i]);
                }
            }
        }
        self.utility = options.utility || {};
    },

    start: function() {
        var self = this;

        var server = self.server = ws.createServer(function(conn) {

            console.log("New connection");
            console.log("Key:", conn.key);
            console.log("Headers:", conn.headers);

            self.connections[conn.key] = conn;

            conn.on("text", function(str) {
                console.log("Received " + str);
                for (var i = 0; i < self.events.text.length; ++i) {
                    self.events.text[i](str, conn);
                }
                if (conn.Data) {
                    conn.sendText(JSON.stringify(conn.Data));
                    conn.Data = null;
                }
            });
            conn.on("close", function(code, reason) {
                console.log("Connection closed");
                console.log("Code:", code);
                console.log("Reason:", reason);
                self.connections[conn.key] = null;
                for (var i = 0; i < self.events.close.length; ++i) {
                    self.events.close[i](code, reason);
                }
            });
        }).listen(self.port);

        console.log("websocket:server Listening on port " + self.port);
    },

    broadcast: function(msg) {
        var self = this;
        self.server.connections.forEach(function(conn) {
            conn.sendText(msg);
        });
    },

    parseJSON: function(msg) {
        try {
            msg = JSON.parse(msg);
        } catch (ex) {
            msg = {};
        }
        return msg;
    },

    isJSON: function(msg) {
        var ret = true;
        try {
            var o = JSON.parse(msg);
        } catch (ex) {
            ret = false;
        }
        return ret;
    },

    server: null,
    port: 3001,
    connections: {},

    events: {
        'text': [],
        'close': []
    }
});

module.exports = WebSocketServer;
