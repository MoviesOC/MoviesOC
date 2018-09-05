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
router.get('/user-profile', ensureAuthenticated, (req, res) => {
    res.render('user-profile', { user: req.user });
});

// 2.1) GET / user movie ---> liked page

router.get('/user-liked', (req, res, next) => {
    Movie.find({ _owner: req.user._id }).then(movies => {
        let liked = [];
        movies.map(movie => {
            if (movie.category === 'like') {
                liked.push(movie);
            } else {
                console.log('error');
            }
        });
        res.render('user-liked', { liked });
    });
});

// 2.2) GET / user movie ---> hated page

router.get('/user-hated', (req, res, next) => {
    Movie.find({ _owner: req.user._id }).then(movies => {
        let hated = [];
        movies.map(movie => {
            if (movie.category === 'hate') {
                hated.push(movie);
            } else {
                console.log('error');
            }
        });
        res.render('user-hated', { hated });
    });
});
// 2.3) GET / user movie ---> watched page

router.get('/user-watched', (req, res, next) => {
    Movie.find({ _owner: req.user._id }).then(movies => {
        let watched = [];
        movies.map(movie => {
            if (movie.category === 'watched') {
                watched.push(movie);
            } else {
                console.log('error');
            }
        });
        res.render('user-watched', { watched });
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
    let language = '&language=en-US&with_original_language=en';
    let voteAverage = '&vote_average.gte=6.5';
    let page = '&page=' + randomNum(100);
    let resultIndex = randomNum(20);
    let movieGenreId = '';
    if (genre) movieGenreId = '&with_genres=' + genre;

    let movieUrl = ''.concat(baseUrl + apiKey + language + voteAverage + page + movieGenreId);
    // let noAdult = '&include_adult=false';
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
                image: baseImgUrl + response.data.results[resultIndex].poster_path,
                title: response.data.results[resultIndex].title,
                releaseYear: response.data.results[resultIndex].release_date,
                rating: response.data.results[resultIndex].vote_average,
                plot: response.data.results[resultIndex].overview,
                id: response.data.results[resultIndex].id,
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

/*
// --------> 5.) Get Movie details
*/

router.get('/movies/:id', (req, res, next) => {
    Movie.findById(req.params.id).then(movie => {
        let tmdbid = movie.tmdbId;
        let dbId = req.params.id;
        let baseUrl = 'https://api.themoviedb.org/3/movie/';
        let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
        const apiKey = process.env.MOVIEDB_API_KEY;
        let language = '&language=en-US';
        let movieUrl = ''.concat(
            baseUrl + tmdbid + '?api_key=' + apiKey + language + '&append_to_response=videos'
        );
        console.log('MOVIE URL =====================', movieUrl);
        axios
            .get(movieUrl)
            .then(response => {
                let youtubeKey =
                    response.data.videos.results.length !== 0
                        ? response.data.videos.results[0].key
                        : null;
                if (youtubeKey) {
                    var youtubeLink = 'https://www.youtube.com/embed/' + youtubeKey + '?autoplay=0';
                }
                res.render('details', {
                    data: response.data,
                    image: baseImgUrl + response.data.poster_path,
                    title: response.data.title,
                    releaseYear: response.data.release_date,
                    rating: response.data.vote_average,
                    plot: response.data.overview,
                    id: response.data.id,
                    dbId: dbId,
                    youtubeLink: youtubeLink,
                    genres: response.data.genres
                });
            })
            .catch(err => {
                console.error(err);
            });
    });
    // console.log('MOVIE__________________________________', movie);
});
/*
// --------> 6.) Delete Movie from DB+list
*/

router.get('/movies/:id/delete', (req, res, next) => {
    Movie.findByIdAndRemove(req.params.id)
        .then(movie => {
            console.log('The movie was deleted!!!:' + movie);
            res.redirect('/user-profile');
        })
        .catch(error => {
            console.log(error);
        });
});

/*
// --------> 7.) Change Category of movie
*/

router.get('/movies/:id/edit', (req, res, next) => {
    Movie.findByIdAndUpdate(req.params.id, { category: req.query.category }, { new: true }).then(
        updatedMovie => {
            res.redirect('/user-profile');
        }
    );
});

module.exports = router;
