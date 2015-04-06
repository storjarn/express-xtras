var _ = require('underscore');

module.exports = exports = function tags_Plugin(schema, options) {
    var schemaAdd = {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        }
    };
    schemaAdd.title = _.extend(schemaAdd.title, options || {});
    schema.add(schemaAdd);

    schema.path('title').index(true);
};
