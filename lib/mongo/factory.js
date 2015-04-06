var db;

var loggers = require('../loggers');
var log = loggers('util', 'data-factory').info;

var _ = require('underscore');

module.exports = function(options, config) {
    options = options || {};
    var mongoose = require('mongoose');
    var connector = require('./connector')(options.database, config);
    // connector.server.close();

    if (!db) {
        log("Creating new mongo connection for mongoose");
        db = mongoose.createConnection(connector.connectionString);
    }

    var Schema = mongoose.Schema;

    return {
        'model': function(modelName, schema, options) {
            var model = null;
            try {
                model = db.model(modelName);
            } catch (ex) {
                if (!schema) {
                    throw new Error("You must provide a schema when asking for a model that hasn't been created yet!");
                }
                if (!(schema instanceof Schema)) {
                    options = _.extend({
                        collection: modelName.toLowerCase(),
                        minimize: false
                    }, options || {});
                    schema = new Schema(schema, options);
                }
                model = db.model(modelName, schema, modelName.toLowerCase());
            }
            return model;
        },
        Schema: Schema,
        Fields: {
            String: String,
            Number: Number,
            Date: Date,
            Array: Array,
            Boolean: Boolean,
            Buffer: Buffer,
            ObjectId: Schema.Types.ObjectId,
            Mixed: Schema.Types.Mixed
        },
        mongoose: mongoose,
        db: db,
        log: log
    };

    // console.log(category);

    // category.find({}, function (err, docs) {
    //     console.dir(docs);
    //     // Let's close the db
    //     // mongoose.connection.close();
    // });


    // var Test = mongoose.model('test', new Schema({
    //     enabled           : Boolean
    //   , description     : String
    //   , created_at      : Date
    //   , updated_at      : Date
    // }, { collection : 'test' }));

    // var test = new Test({
    //     enabled: false,
    //     description: "Hello"
    // }).save(function(err, model, numberAffected){
    //     console.log(err, model, numberAffected);
    //     mongoose.connection.close();
    // });

};
