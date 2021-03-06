module.exports = function(app) {
    app.log("Setting up database connection(s)");
    app.set('data', {
        factory: require('./mongo/factory')({}, app.get('config')),
        runner: require('./mongo/runner')
    });
    // var MongoClient = require('mongodb').MongoClient;
    // var dbRet = {};

    // for (var key in app.config.db) {
    //     if (app.config.db[key].type === 'mongo') {
    //         var log = app.loggers('util', 'mongodb').info;
    //         var server = app.config.db[key].server || '127.0.0.1';
    //         var port = app.config.db[key].port || 27017;
    //         var username = app.config.db[key].username || '';
    //         var password = app.config.db[key].password || '';
    //         var repositoryName = app.config.db[key].name;
    //         if (repositoryName) {
    //             (function(dbRet, repositoryName) {
    //                 var connString = server + ':' + port + '/' + repositoryName;
    //                 if (username) {
    //                     connString = username + ":" + password + "@" + connString;
    //                 }
    //                 connString = 'mongodb://' + connString;
    //                 MongoClient.connect(connString, function(err, db) {
    //                     if (err) throw err;
    //                     dbRet[repositoryName] = db;
    //                     log(repositoryName + " is connected");
    //                 });
    //             })(dbRet, repositoryName);
    //         }
    //     }

    //     //TODO:: add support for sqlite, mysql, postgresql
    // }

    // process.on('exit', function() {
    //     for (var repositoryName in dbRet) {
    //         processDb(repositoryName, function(db) {
    //             try {
    //                 db.close();
    //             } catch (ex) {
    //                 console.warn("Database / repository " + repositoryName + ' already closed');
    //             }
    //         });
    //     }
    // });

    // function processDb(dbName, fn) {
    //     if (!dbRet[dbName]) {
    //         throw new Error("Database / repository " + dbName + ' isn\'t available');
    //     }
    //     return fn(dbRet[dbName]);
    // }

    // return processDb;
};
