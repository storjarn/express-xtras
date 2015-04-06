var _S = require('underscore.string');

module.exports = exports = function slugify_Plugin(schema, options) {
    options = options || {};
    var from = options.keyFrom || 'title';
    var to = options.keyTo || 'slug';

    var schemaAdd = {};
    schemaAdd[to] = {
        type: String,
        required: true,
        unique: true
    };

    schema.add(schemaAdd);

    schema.pre('save', function(next) {
        this[to] = _S.slugify(this[from]);
        next();
    });

    schema.path(to).index(true);
};
