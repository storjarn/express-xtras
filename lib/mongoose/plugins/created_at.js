module.exports = exports = function created_at_Plugin(schema, options) {
    schema.add({
        created_at: Date
    });

    schema.pre('save', function(next) {
        if (this.isNew) {
            this.created_at = new Date();
        }
        next();
    });

    if (options && options.index) {
        schema.path('created_at').index(options.index);
    }
};
