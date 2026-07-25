const express = require('express');
const router = express.Router();
const passport = require('passport'); 

//Login
router.get('/login', passport.authenticate('github', { scope: ['user:email']}));

//redirect back endpoint handling from github
router.get('/github/callback',
    passport.authenticate('github', {failureRedirect: '/auth/failure'}),
    (req,res) => {
        res.json({
            message: 'Successfully authenticated via GitHub Passport!',
            user: req.user.username
        });
    }
);

//Fallback route if GitHub authentication fails
router.get('/failure', (req,res) => {
    res.status(401).json({ error: 'GitHub authentication failed.'});
});

//Logout endpoint
router.get('/logout', (req,res,next) =>{
    req.logout((err) => {
        if (err) { return next(err); } 
        res.json({ message: 'Logged out.'});
    });
});

module.exports = router;