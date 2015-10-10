module.exports = exports = function publish_off_Plugin(schema, options) {
    schema.add({
        publish_off: Date
    });

    if (options && options.index) {
        schema.path('publish_off').index(options.index);
    }
};
