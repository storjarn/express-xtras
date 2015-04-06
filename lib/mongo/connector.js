module.exports = function(databaseName, config) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var Server = mongodb.Server;
    var ISODate = mongodb.ISODate;

    var dbConfig = null;
    var connString = '';
    var client = null;
    var server = null;

    if (databaseName) {
        if (config.db[databaseName] && config.db[databaseName].type === 'mongo') {
            dbConfig = config.db[databaseName];
        }
    } else {
        for (var dbName in config.db) {
            if (config.db[dbName].type === 'mongo') {
                dbConfig = config.db[dbName];
                break;
            }
        }
    }

    if (dbConfig) {
        connString = ['mongodb://', dbConfig.host, ':', dbConfig.port, '/', dbConfig.name].join('');
        server = new Server(dbConfig.host || 'localhost', dbConfig.port || 27017);
        client = new MongoClient(server, {
            native_parser: true
        });
    }

    return {
        client: client,
        server: server,
        connectionString: connString,
        config: dbConfig
    };
};
