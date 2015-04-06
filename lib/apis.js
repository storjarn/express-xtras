module.exports = function(app) {
    app.set('apis', {
        google: require('googleapis'),
        github: require('github'),
        youtube: require("youtube-api"),
        meetup: require('meetup-api'),
        wunderground: require('wunderground-api'),
        steam: require('steam-api'),
        arduino: require('arduino-api')
    });
};
