module.exports = function(app) {
    var utils = app.get('utils');
    var config = app.get('config');
    var basePath = config.basePath;

    function generateResponseData() {
        return {
            "requestorInformation": {
                "receivedParams": {}, //array_merge($this->request->get(), $this->request->post(), $this->request->put()),
                "remoteAddress": '', //$this->request->getIp()
            },
            "serverInformation": {
                "apiVersion": "1.0.0",
                "currentTime": new Date().getTime(),
                "requestDuration": 0,
                "appName": app.locals.siteName,
                "serverName": '',
                "hostName": require('os').hostname(),
                "protocol": 'http'
            }
        };
    }

    function prepareResponse(data, req, res) {
        data = data || {};
        data = utils._.extend(res.Data || generateResponseData(), data);

        // data.serverInformation.requestDuration = new Date().getTime() - res.Data.serverInformation.currentTime;
        data.serverInformation.requestDuration = new Date().getTime() - req.startTime;
        data.serverInformation.protocol = req.protocol;
        data.serverInformation.path = utils.Path.join(req.baseUrl || '', req.path || '');
        data.serverInformation.secure = req.secure;
        data.serverInformation.xhr = req.xhr;

        data.requestorInformation.remoteAddress = req.ip;
        data.requestorInformation.receivedParams = utils._.extend(req.params, req.query);

        return data;
    }

    app.pageData = function(data, req, res) {
        var meta = generateResponseData();
        data = utils._.extend(meta, data || {});
        if (!!req && !!res) {
            data = prepareResponse(data, req, res);
        }
        return data;
    };

    app.log("Using request data middleware");
    app.log("Using request end middleware");
    app.use(function(req, res, next) {

        //Request augmentation
        res.Data = generateResponseData();

        var realEnd = res.end;
        res.end = function() {
            // App.Menu = null;
            realEnd.apply(res, arguments);
        };
        var realSend = res.send;
        res.send = function(data) {
            if (typeof data == "object") {
                data = prepareResponse(data, req, res);
            }
            realSend.call(res, data);
        };
        next();
    });
};
