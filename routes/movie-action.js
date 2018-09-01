const express = require('express');
const router = express.Router();

/*
//for testing if route works:
router.get('/movie-action', (req, res, next) => {
    res.render('movie-action');
});
*/

// Ensure only registered users have acces to movie-detail page:
router.get('/movie-action', ensureAuthenticated, (req, res) => {
    res.render('movie-action', { user: req.user });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = router;
