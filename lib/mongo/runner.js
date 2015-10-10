module.exports = function(options, config) {
    var _ = require('underscore');
    options = options || {};
    var cmd = options.cmd;
    var dbConfig = null;
    var connString = '';
    var client = null;

    for (var dbName in config.db) {
        if (config.db[dbName].type === 'mongo') {
            dbConfig = config.db[dbName];
            break;
        }
    }

    options = _.extend(options, _.pick(dbConfig, ['username', 'password']));
    // console.log(options);

    var done = function (error, stdout, stderr) {
        if (error) {
            console.error(error);
        } else {
            console.log(stdout);
        }
        if (options.done) {
            options.done(error, stdout, stderr);
        }
    };
    if (!cmd) {
        throw new Error('mongo-runner.js: cmd is empty!');
    }
    if (options.username) {
        var cmdBits = cmd.split('mongo ');
        if (options.password) {
            cmdBits.unshift('-p ' + options.password);
        }
        cmdBits.unshift('-u ' + options.username);
        // console.log(cmdBits);
        cmd = 'mongo ' + cmdBits.join(' ');
    }
    console.log(cmd);
    var exec = require('child_process').exec;
    exec(cmd, done);
};
