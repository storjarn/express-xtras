module.exports = function(app) {
    var config = app.get('config');
    var basePath = config.basePath;

    var session = require('express-session');
    var RedisStore = require('connect-redis')(session);

    var sessionOptions = {
        store : new RedisStore({
            client: null, // An existing client created using redis.createClient()
            host: 'localhost', // Redis server hostname
            port: 6379, // Redis server portno
            socket: null // Redis server unix_socket
        }),
        secret: 'interest is the key to genius',
        resave: false,
        saveUninitialized: false
    };

    app.log("Using express-session middleware");
    app.use(session(sessionOptions));

};
