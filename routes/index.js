const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.post('/movie-comedy/like', (req, res, next) => {
    console.log('DEBUG req.body', req.body);
    const { title, tmdbId, picture, category } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({ title, tmdbId, picture, category, _owner: ownerId });
    console.log('POST', title, tmdbId, picture, category);
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-comedy');
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});

router.post('/movie-comedy/hate', (req, res, next) => {
    console.log('DEBUG req.body', req.body);
    const { title, tmdbId, picture, category } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({ title, tmdbId, picture, category, _owner: ownerId });
    console.log('POST', title, tmdbId, picture, category);
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-comedy');
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});

router.post('/movie-comedy/done', (req, res, next) => {
    console.log('DEBUG req.body', req.body);
    const { title, tmdbId, picture, category } = req.body;
    const ownerId = req.user._id;
    const newMovie = new Movie({ title, tmdbId, picture, category, _owner: ownerId });
    console.log('POST', title, tmdbId, picture, category);
    newMovie
        .save()
        .then(movie => {
            res.redirect('/movie-comedy');
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

module.exports = router;
