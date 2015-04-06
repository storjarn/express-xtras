module.exports = function(app) {
    // Init menu object
    app.log("Using active menu middleware");
    var ActiveMenu = require('active-menu');
    var mainMenu = new ActiveMenu('mainMenu');
    mainMenu.setAttributes({
        class: 'menu',
        id: 'main-menu'
    });
    // Set on App to use in routes and whatnot
    app.set('mainMenu', mainMenu);

    var footerMenu = new ActiveMenu('footerMenu');
    footerMenu.setAttributes({
        class: 'menu',
        id: 'footer-menu'
    });
    app.set('footerMenu', footerMenu);

    app.use(ActiveMenu.menu);
};
