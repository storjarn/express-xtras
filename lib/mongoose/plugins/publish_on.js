module.exports = exports = function publish_on_Plugin(schema, options) {
    schema.add({
        publish_on: Date
    });

    schema.pre('save', function(next) {
        if (this.isNew && !this.publish_on) {
            this.publish_on = new Date();
        }
        next();
    });

    if (options && options.index) {
        schema.path('publish_on').index(options.index);
    }
};
