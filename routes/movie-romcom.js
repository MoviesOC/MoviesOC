const express = require('express');
const router = express.Router();

/*
//for testing if route works:
router.get('/movie-romcom', (req, res, next) => {
    res.render('movie-romcom');
});
*/

// Ensure only registered users have acces to movie-detail page:
router.get('/movie-romcom', ensureAuthenticated, (req, res) => {
    res.render('movie-romcom', { user: req.user });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = router;
