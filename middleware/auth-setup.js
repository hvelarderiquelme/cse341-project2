const session = require('express-session');
const passport = require('../config/passport');

function initAuth(app) {
    //Session middleware setup (Must be declared before passport.session())
    app.use(session({
      secret: process.env.SESSION_SECRET || 'FOR_LOCAL_DEV_ONLY',
      resave: false,
      saveUninitialized: false
    }));

    //Initialize Passport and tie it into express sessions
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = {initAuth};