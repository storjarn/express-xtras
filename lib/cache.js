module.exports = function(app) {

    var redis = require("redis"),
        jsonify = require('redis-jsonify'),
        client = jsonify(redis.createClient());
    client.on("error", function (err) {
        console.error(err);
    });
    app.set('redis', redis);
    app.set('redis-client', client);
    app.log("Setting redis client");

    if (app.get('env') === 'production') {
        // app.log("Using quickdraw caching middleware");
        // var quickdraw = require('quickdraw')(app);
    }
};
