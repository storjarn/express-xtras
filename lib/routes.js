module.exports = function(app) {
    var utils = app.get('utils');

    utils.createRoute = function(router, method, url, action, options) {
        options = options || {};
        var aRoute = router[method.toLowerCase()](url, action);
        for(var i = 0; i < aRoute.stack.length; ++i) {
            for(var key in options) {
                aRoute.stack[i].route[key] = options[key];
            }
        }
        return aRoute;
    };

    utils.getRoutes = function (options) {
        options = options || {};
        var route, routes = {};
        var urlPattern = options.urlPattern || '';

        function addRoute(route) {
            if (route) {
                if (urlPattern) {
                    if (route.path.indexOf(urlPattern) > -1) {
                        routes[route.path] = route;
                    }
                } else {
                    routes[route.path] = route;
                }
            }
        }

        app._router.stack.forEach(function(middleware){
            if(middleware.route){ // routes registered directly on the app
                addRoute(middleware.route);
            } else if(middleware.name === 'router'){ // router middleware
                middleware.handle.stack.forEach(function(handler){
                    route = handler.route;
                    addRoute(route);
                });
            }
        });
        return routes;
    };

    utils.expressProxy = function(req, res, next) {
        var request = utils.request;
        var url = decodeURIComponent(req.query.url);
        console.log(url);
        // var url = 'http://gdata.youtube.com/feeds/api/playlists/56D792A831D0C362/?v=2&alt=json&feature=plcp';
        var r = null;

        // when it's post request set up a request.post to have our post body
        if(req.method === 'POST') {
            r = request.post({uri: url, json: req.body});
        } else {
            r = request(url);
        }
        req.pipe(r).pipe(res);
    };

    app.set('utils', utils);
};
