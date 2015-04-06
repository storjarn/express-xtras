module.exports = function(app) {
    var config = app.get('config');
    var basePath = config.basePath;

    app.locals.siteName = app.locals.pageTitle = app.locals.pageHeading = app.get('config').appName;

    app.use(function(req, res, next) {
        res.locals.chromeless = false;
        next();
    });

};
