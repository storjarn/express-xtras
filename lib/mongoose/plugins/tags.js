var _ = require('underscore');

module.exports = exports = function tags_Plugin(schema, options) {
    var schemaAdd = {
        tags: {
            type: [String],
            index: true
        }
    };
    schema.add(schemaAdd);

    schema.path('tags').index(true);
};
