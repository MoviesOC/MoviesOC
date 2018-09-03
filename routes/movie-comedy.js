const express = require('express');
const router = express.Router();
const axios = require('axios');

function randomNum(num) {
    return Math.ceil(Math.random() * num);
}
//function getComedyMovie() {
router.get('/movie-comedy', ensureAuthenticated, (req, res) => {
    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    const apiKey = 'dc08a5c8305a1ec46c91df025d899797';
    let language = '&language=en-US';
    let noAdult = '&include_adult=false';
    let page = '&page=' + randomNum(1000);
    let comedyGenreId = '&with_genres=35';
    let movieUrl = ''.concat(baseUrl + apiKey + language + noAdult + page + comedyGenreId);

    axios
        .get(movieUrl)
        .then(response => {
            console.log('\n\n\n');
            console.log('-----------------------------------------');
            console.log(response.data.results[0].title);
            res.render('movie-comedy', { user: req.user, data: response.data });
        })
        .catch(err => {
            console.error(err);
        });
});
//}

// Ensure only registered users have acces to movie-detail page:
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = router;
