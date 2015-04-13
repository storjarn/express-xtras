module.exports = function(app) {
    var utils = app.get('utils');
    var config = app.get('config');
    var basePath = config.basePath;

    // view engine setup
    app.set('views', utils.Path.join(basePath, config.viewPath));
    app.engine(config.viewEngine.name, config.viewEngine.module);
    app.set('view engine', config.viewEngine.name);

    app.set('json spaces', app.get('env') === 'production' ? 0 : 4);

    // View Helpers
    app.locals.helpers = require('native-view-helpers');

    // Scripts and Styles
    app.use(function(req, res, next) {
        res.locals.scripts = [].concat((config.scripts || []));
        res.locals.styles = [].concat((config.styles || []));

        res.locals.scripts.render = function() {
            return utils._.map(res.locals.scripts || [], function(scriptDef) {
                if (scriptDef) {
                    if (typeof scriptDef === 'string') {
                        return scriptDef;
                    }
                    scriptDef = utils._.extend({
                        type: 'text/javascript'
                    }, scriptDef);
                    var attrs = utils._.omit(scriptDef, 'text');
                    var ret = ['<script'];
                    utils._.map(attrs, function(value, attrName) {
                        ret.push(attrName + '="' + value + '"');
                    });
                    ret.push('>');
                    if ('text' in scriptDef) {
                        ret.push("\n" + scriptDef.text + "\n");
                    }
                    ret.push('\n</script>');
                    return ret.join(' ');
                }
            }).join('\n');
        };

        res.locals.scripts.replaceRequireBootstrap = function(newBootstrap) {
            var scripts = (res.locals.scripts || []);
            for(var i = 0; i < scripts.length; ++i) {
                if (typeof scripts[i] === 'object') {
                    if ('data-main' in scripts[i]) {
                        if (typeof newBootstrap === 'object') {
                            utils._.extend(scripts[i], newBootstrap);
                        } else if (typeof newBootstrap === 'string') {
                            scripts[i] = newBootstrap;
                        }
                        break;
                    }
                } else if (typeof scripts[i] === 'string') {
                    if (scripts[i].indexOf('data-main') > -1) {
                        scripts[i] = newBootstrap;
                        break;
                    }
                }
            }
        };

        res.locals.styles.render = function() {
            return utils._.map(res.locals.styles || [], function(styleDef) {
                if (styleDef) {
                    if (typeof styleDef === 'string') {
                        return styleDef;
                    }
                    var ret = [];
                    if ('text' in styleDef) {   //Style tag
                        styleDef = utils._.extend({
                            type: 'text/css'
                        }, styleDef);
                        var attrs = utils._.omit(styleDef, 'text');
                        ret.push('<style');
                        utils._.map(attrs, function(value, attrName) {
                            ret.push(attrName + '="' + value + '"');
                        });
                        ret.push('>');
                        ret.push("\n" + styleDef.text + "\n");
                        ret.push('\n</style>');
                    } else {
                        styleDef = utils._.extend({
                            rel: 'stylesheet'
                        }, styleDef);
                        ret.push('<link');
                        utils._.map(styleDef, function(value, attrName) {
                            ret.push(attrName + '="' + value + '"');
                        });
                        ret.push('/>');
                    }
                    return ret.join(' ');
                }
            }).join('\n');
        };

        next();
    });

    // CSS / Less
    app.use(require('less-middleware')(utils.Path.join(__dirname, 'public')));

    // Plaits form model middleware
    var Plaits = require('plaits');
    app.use(Plaits.ExpressMiddleware());
    app.set('plaits', Plaits);
};
