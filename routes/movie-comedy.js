const express = require('express');
const router = express.Router();

/*
//for testing if route works:
router.get('/movie-comedy', (req, res, next) => {
    res.render('movie-comedy');
});
*/

// Ensure only registered users have acces to movie-detail page:

router.get('/movie-comedy', ensureAuthenticated, (req, res) => {
    axios.get('').then(response => {
        res.render('movie-comedy', { user: req.user, data: response.data });
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}

module.exports = router;
