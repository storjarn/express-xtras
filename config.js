module.exports = function(app, basePath, config) {

    var utils = app.get('utils');

    var defaultConfig = {
        appName: 'express-xtras',
        basePath: basePath,
        favIcon: 'public/favicon.ico',
        viewPath: 'views',
        publicPath: 'public',
        logger: 'morgan',
        viewEngine: {
            name: 'ejs',
            module: require('ejs-locals')
        }
    };

    var configPath = utils.Path.join(basePath, 'config.js');
    if (utils.fs.existsSync(configPath)) {
        var tmpConfig = require(configPath);
        config = utils._.extend(tmpConfig, config);
    }
    config = utils._.extend(defaultConfig, config);
    app.set('config', config);
};
