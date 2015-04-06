module.exports = function(app) {
    var flash = require('connect-flash');
    app.log("Using connect-flash session message middleware");
    app.use(flash()); // use connect-flash for flash messages stored in session
};
