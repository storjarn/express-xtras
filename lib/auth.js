module.exports = function(app) {
    var crypto = app.get('utils').crypto;
    var passwordless = require('passwordless');
    var MongoStore = require('passwordless-mongostore');

    var passport = require('passport');
    app.set('passport', passport);
    app.log("Using passport authentication middleware");
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
        function(username, password, done) {
            var auth = app.get('config').auth;
            for (var i = 0; i < auth.users.length; ++i) {
                var user = auth.users[i];
                // console.log(user.password, password);
                if (user.username === username && user.password === password) {
                    var sessUser = {
                        username: username,
                        // password : crypto.hmac(user.password, auth.secret),
                        isAuthenticated : true
                    };
                    return done(null, sessUser);
                } else {
                    var err = new Error("Invalid username and password");
                    err.status = 403;
                    return done(err);
                }
            }
        }
    ));

    app.use(function(req, res, next) {
        if (req.session && req.session.passport && req.session.passport.user) {
            res.locals.user = req.session.passport.user;
        } else {
            res.locals.user = {
                isAuthenticated: false
            };
        }
        next();
    });

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
