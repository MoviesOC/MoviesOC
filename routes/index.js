require('dotenv').config();
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/User');
const axios = require('axios');

/*
// --------> 1.) GET / home page
*/
router.get('/', (req, res, next) => {
    res.render('index');
});

/*
// --------> 2.) GET / to user profile page
*/

router.get('/user-profile', (req, res) => {
    Movie.find({ _owner: req.user._id }).then(movies => {
        res.render('user-profile', { movies });
    });
});

/*
// --------> 3.) GET / to movie-suggestion page
*/

router.get('/movie-suggestion', ensureAuthenticated, (req, res, next) => {
    let { genre } = req.query;
    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
    const apiKey = process.env.MOVIEDB_API_KEY;
    let language = '&language=en-US';
    let noAdult = '&include_adult=false';
    let page = '&page=' + randomNum(1000);
    let movieGenreId = '';
    if (genre) movieGenreId = '&with_genres=' + genre;

    let movieUrl = ''.concat(baseUrl + apiKey + language + page + movieGenreId);
    // call API with axios:
    axios
        .get(movieUrl)
        .then(response => {
            // console.log('\n\n\n');
            // console.log('-----------------------------------------');
            // console.log(response.data.results);
            res.render('movie-suggestion', {
                user: req.user,
                data: response.data,
                image: baseImgUrl + response.data.results[0].poster_path,
                title: response.data.results[0].title,
                releaseYear: response.data.results[0].release_date,
                rating: response.data.results[0].vote_average,
                plot: response.data.results[0].overview,
                id: response.data.results[0].id,
                genre: req.query.genre
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// 3.1) Get a random Number:
function randomNum(num) {
    return Math.ceil(Math.random() * num);
}
// 3.2) Ensure only registered users have acces to movie-detail& user profile page:
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}
/*
// --------> 4.) Push like/hate/already seen movie to user profile page array
*/

router.post('/movie-suggestion/:category', (req, res, next) => {
    const { title, tmdbId, picture } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({
        title,
        tmdbId,
        picture,
        category: req.params.category,
        _owner: ownerId
    });
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-suggestion/?genre=' + req.body.genre);
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});
module.exports = router;
