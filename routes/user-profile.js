const express = require('express');
const router = express.Router();

// Ensure only registered users have acces to user profile page:

router.get('/user-profile', ensureAuthenticated, (req, res) => {
    res.render('user-profile', { user: req.user });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}

module.exports = router;
