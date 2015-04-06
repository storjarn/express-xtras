module.exports = exports = function updated_at_Plugin(schema, options) {
    schema.add({
        updated_at: { type: Date, default: Date.now }
    });

    schema.pre('save', function(next) {
        this.updated_at = new Date();
        next();
    });

    if (options && options.index) {
        schema.path('updated_at').index(options.index);
    }
};
