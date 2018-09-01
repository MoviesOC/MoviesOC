const express = require('express');
const router = express.Router();
/*
//for testing if route works:
router.get('/movie-random', (req, res, next) => {
    res.render('movie-random');
});
*/

// Ensure only registered users have acces to movie-detail page:
router.get('/movie-random', ensureAuthenticated, (req, res) => {
    res.render('movie-random', { user: req.user });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = router;
