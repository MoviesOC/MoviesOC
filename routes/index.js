const express = require('express');
const router = express.Router();
const axios = require('axios');

function randomNum(num) {
    return Math.ceil(Math.random() * num);
}
// GET home page
router.get('/', (req, res, next) => {
    res.render('index');
});

// GET Movie-suggestion page
router.get('/movie-suggestion', ensureAuthenticated, (req, res, next) => {
    let { genre } = req.query;
    // if (!genre) genre = '35'; // Default value
    // let comedyGenreId = '&with_genres=35';

    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    const apiKey = 'dc08a5c8305a1ec46c91df025d899797';
    let language = '&language=en-US';
    // let noAdult = '&include_adult=false';
    let page = '&page=' + randomNum(1000);
    let comedyGenreId = '';
    if (genre) comedyGenreId = '&with_genres=' + genre;

    let movieUrl = ''.concat(baseUrl + apiKey + language + page + comedyGenreId);

    axios
        .get(movieUrl)
        .then(response => {
            console.log('\n\n\n');
            console.log('-----------------------------------------');
            console.log(response.data.results[0].title);
            res.render('movie-suggestion', {
                user: req.user,
                data: response.data,
                title: response.data.results[0].title
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Ensure only registered users have acces to movie-detail page:
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
module.exports = router;
