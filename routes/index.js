const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/User');
const axios = require('axios');

function randomNum(num) {
    return Math.ceil(Math.random() * num);
}
// GET home page
router.get('/', (req, res, next) => {
    res.render('index');
});

router.post('/movie-suggestion/like', (req, res, next) => {
    console.log('DEBUG req.body', req.body);
    const { title, tmdbId, picture, category } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({ title, tmdbId, picture, category, _owner: ownerId });
    console.log('POST', title, tmdbId, picture, category);
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-suggestion');
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});

router.post('/movie-suggestion/hate', (req, res, next) => {
    console.log('DEBUG req.body', req.body);
    const { title, tmdbId, picture, category } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({ title, tmdbId, picture, category, _owner: ownerId });
    console.log('POST', title, tmdbId, picture, category);
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-suggestion');
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});

router.post('/movie-suggestion/done', (req, res, next) => {
    console.log('DEBUG req.body', req.body);
    const { title, tmdbId, picture, category } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({ title, tmdbId, picture, category, _owner: ownerId });
    console.log('POST', title, tmdbId, picture, category);
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-suggestion');
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});

router.get('/user-profile', (req, res) => {
    Movie.find({ _owner: req.user._id }).then(movies => {
        res.render('user-profile', { movies });
    });
});

// GET Movie-suggestion page
router.get('/movie-suggestion', ensureAuthenticated, (req, res, next) => {
    let { genre } = req.query;
    // if (!genre) genre = '35'; // Default value
    // let movieGenreId = '&with_genres=35';

    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    const apiKey = 'dc08a5c8305a1ec46c91df025d899797';
    let language = '&language=en-US';
    let noAdult = '&include_adult=false';
    let page = '&page=' + randomNum(1000);
    let movieGenreId = '';
    if (genre) movieGenreId = '&with_genres=' + genre;

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
