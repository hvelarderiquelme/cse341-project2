//Create the Authentication guard middleware
//middleware/requireAuth.js

/**
 * Custom middleware to block unauthenticated requests.
 * Passport automatically adds the 'req.isAuthenticated()' helper method.
 */

function requireAuth (req,res,next) {
    if (req.isAuthenticated()){
        return next();//User is logged via GitHUb passport, proceed to the route handler
    }
    //If not Logged in, block the request and return a 401 unathorized status
    res.status(401).json({
        error: 'Unathorized.',
        details: 'You must log in via GitHub first.'
    });
};

module.exports = { requireAuth };