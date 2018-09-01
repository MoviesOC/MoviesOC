const express = require('express');
const router = express.Router();

// router.get('/movie-drama', (req, res, next) => {
//     res.render('movie-drama');
// });

// Ensure only registered users have acces to movie-detail page:
router.get('/movie-drama', ensureAuthenticated, (req, res) => {
    res.render('movie-drama', { user: req.user });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = router;
