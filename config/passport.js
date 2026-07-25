const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

//defining GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL || "http://localhost:8080/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done){
    //passport extracts the user's GitHub data into the 'profile' parameter
    return done(null,profile);
  }
));

//Serialize user into cookie session
passport.serializeUser((user,done) => {
  done(null,user);
});

//deserialize user from cookie session and subsequent requests
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;