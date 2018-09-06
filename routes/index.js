require('dotenv').config();
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/User');
const axios = require('axios');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const checkLoggedIn =
    /*
// -------------------> 1.) GET / HOME PAGE -->> index.hbs
*/
    router.get('/', (req, res, next) => {
        res.render('index');
    });

/*
// -------------------> 2.) GET / MOVIE-SUGGESTION PAGE -->> movie-suggestion.hbs
*/

// --------> 2.1) GET / Comedy, Action, Thriller, Drama, Science Fiction, Documentary, Chick Flick &Random
router.get('/movie-suggestion', ensureAuthenticated, (req, res, next) => {
    console.log('Tried suggesting');
    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
    const apiKey = process.env.MOVIEDB_API_KEY;
    let language = '&language=en-US&with_original_language=en';
    let voteAverage = '&vote_average.gte=6.5';
    let page = '&page=' + randomNum(100);
    let resultIndex = randomNum(20);
    let { genre } = req.query;
    let movieGenreId = '';
    if (genre) movieGenreId = '&with_genres=' + genre;
    let movieUrl = ''.concat(baseUrl + apiKey + language + voteAverage + page + movieGenreId);

    // Get API information with axios:
    axios
        .get(movieUrl)
        .then(response => {
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

// --------> 2.2) GET / Classic Movie
router.get('/movie-suggestion/classic', ensureAuthenticated, (req, res, next) => {
    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
    const apiKey = process.env.MOVIEDB_API_KEY;
    let language = '&language=en-US&with_original_language=en';
    let voteAverage = '&vote_average.gte=6.5';
    let page = '&page=' + randomNum(100);
    let classicMovie = '&release_date.gte=1900-01-01&release_date.lte=1990-01-01';
    let { genre } = req.query;
    let resultIndex = randomNum(20);
    let movieGenreId = '';
    if (genre) movieGenreId = '&with_genres=' + genre;

    let movieUrl = ''.concat(
        baseUrl + apiKey + language + voteAverage + page + classicMovie + movieGenreId
    );

    // Get API information with axios:
    axios
        .get(movieUrl)
        .then(response => {
            res.render('movie-suggestion', {
                user: req.user,
                data: response.data,
                image: baseImgUrl + response.data.results[resultIndex].poster_path,
                title: response.data.results[resultIndex].title,
                releaseYear: response.data.results[resultIndex].release_date,
                rating: response.data.results[resultIndex].vote_average,
                plot: response.data.results[resultIndex].overview,
                id: response.data.results[resultIndex].id,
                genre: req.query.genre,
                myCategory: 'classic'
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// --------> 2.3) GET / Trashy Movie
router.get('/movie-suggestion/trashy', ensureAuthenticated, (req, res, next) => {
    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
    const apiKey = process.env.MOVIEDB_API_KEY;
    let language = '&language=en-US&with_original_language=en';
    let page = '&page=' + randomNum(100);
    let trashyMovie = '&vote_average.lte=4.5&release_date.lte=2010-01-01';
    let { genre } = req.query;
    let movieGenreId = '';
    let resultIndex = randomNum(20);
    if (genre) movieGenreId = '&with_genres=' + genre;

    let movieUrl = ''.concat(baseUrl + apiKey + language + trashyMovie + page + movieGenreId);

    // Get API information with axios:
    axios
        .get(movieUrl)
        .then(response => {
            res.render('movie-suggestion', {
                user: req.user,
                data: response.data,
                image: baseImgUrl + response.data.results[resultIndex].poster_path,
                title: response.data.results[resultIndex].title,
                releaseYear: response.data.results[resultIndex].release_date,
                rating: response.data.results[resultIndex].vote_average,
                plot: response.data.results[resultIndex].overview,
                id: response.data.results[resultIndex].id,
                genre: req.query.genre,
                myCategory: 'trashy'
            });
        })
        .catch(err => {
            console.error(err);
        });
});

/*
// --------> 2.4) Push like/hate/already seen movie to user profile page array
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
// --------> 2.5) Push like/hate/already when you're in Trashy movie route:
*/
router.post('/movie-suggestion/trashy/:category', (req, res, next) => {
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
            res.redirect('/movie-suggestion/trashy/'); // ?genre=' + req.body.genre
        })
        .catch(error => {
            console.log('ERROR', error);
        });
});

/*
// --------> 2.2) Get a random Number:
*/
function randomNum(num) {
    return Math.ceil(Math.random() * num);
}
/*
// --------> 2.3) Ensure only registered users have acces to movie-detail& user profile page:
*/
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}

/*
// -------------------> 3.) GET / USER PROFILE PAGE -->> user-profile.hbs
*/

router.get('/user-profile', ensureAuthenticated, (req, res) => {
    res.render('user-profile', { user: req.user });
});

/*
// -------------------> 4.) GET / USERS LIKED/HATED/WATCHED ARRAY PAGE -->> user-movies.hbs
*/

router.get('/user-movies/:category', (req, res, next) => {
    let movieCategory = req.params.category;
    Movie.find({ $and: [{ _owner: req.user._id }, { category: movieCategory }] }).then(movies => {
        let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
        let baseUrl = 'https://api.themoviedb.org/3/movie/';
        const apiKey = process.env.MOVIEDB_API_KEY;
        let language = '&language=en-US';

        Promise.all(
            movies.map(movie => {
                return axios.get(
                    baseUrl +
                        movie.tmdbId +
                        '?api_key=' +
                        apiKey +
                        language +
                        '&append_to_response=videos, recommendations'
                );
            })
        ).then(responses => {
            let moviesInfo = responses.map((response, i) => {
                let youtubeKey =
                    response.data.videos.results.length !== 0
                        ? response.data.videos.results[0].key
                        : null;
                if (youtubeKey) {
                    var youtubeLink = 'https://www.youtube.com/embed/' + youtubeKey + '?autoplay=0';
                }
                return {
                    title: response.data.title,
                    genres: response.data.genres,
                    tmdbId: response.data.id,
                    plot: response.data.overview,
                    picture: baseImgUrl + response.data.poster_path,
                    year: response.data.release_date,
                    tagline: response.data.tagline,
                    rating: response.data.vote_average,
                    youtubeLink: youtubeLink,
                    id: movies[i]._id
                };
            });
            console.log(moviesInfo);
            let word = '';
            switch (movieCategory) {
                case 'like':
                    word = 'liked';
                    break;
                case 'hate':
                    word = 'hated';
                    break;
                case 'watched':
                    word = 'have already seen';
                    break;
            }
            res.render('user-movies', { movieInfo: moviesInfo, word });
        });
    });
});

/*
// --------> 4.1) Delete movie from list
*/

router.get('/movie/:id/delete', (req, res, next) => {
    console.log('going to delete');
    Movie.findByIdAndRemove(req.params.id)
        .then(movie => {
            console.log('The movie was deleted!!!:' + movie);
            res.redirect('/user-movies/' + movie.category);
        })
        .catch(error => {
            console.log(error);
        });
});

/*
// --------> 4.2) Edit movie from list
*/

router.get('/movies/:id/edit', (req, res, next) => {
    let newCategory = req.query.category;
    Movie.findById(req.params.id).then(movie => {
        let oldCategory = movie.category;
        movie.category = newCategory;
        movie.save().then(updatedMovie => {
            res.redirect('/user-movies/' + oldCategory);
        });
    });
});

/*
// ------------------->  5.) GET / MOVIE DETAILS -->> details.hbs
*/

router.get('/movies/:id', (req, res, next) => {
    Movie.findById(req.params.id).then(movie => {
        let tmdbid = movie.tmdbId;
        let dbId = req.params.id;
        console.log(tmdbid);
        let baseUrl = 'https://api.themoviedb.org/3/movie/';
        let baseImgUrl = 'https://image.tmdb.org/t/p/w342/';
        const apiKey = process.env.MOVIEDB_API_KEY;
        let language = '&language=en-US';
        let movieUrl = ''.concat(
            baseUrl + tmdbid + '?api_key=' + apiKey + language + '&append_to_response=videos'
        );
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
                    genres: response.data.genres,
                    tmdbid: tmdbid
                });
            })
            .catch(err => {
                console.error(err);
            });
    });
    // console.log('MOVIE_____________', movie);
});

/*
// -------------------> 6.) Search movies
*/
router.get('/find-movies', (req, res, next) => {
    let searchQuery = req.query.search;
    let baseUrl = 'https://api.themoviedb.org/3/search/movie?';
    let apiKey = process.env.MOVIEDB_API_KEY;
    let language = '&language=en-US';
    let query = '&query=';
    let page = '&page=1';
    let searchUrl = ''.concat(baseUrl + 'api_key=' + apiKey + language + query + searchQuery + page);
    axios.get(searchUrl).then(result => {
        console.log(result.data.results);
        res.render('search-result', { result: result.data.results });
    });
});

/*
// -------------------> 7.) Add search result to Lists
*/
// router.get('/find-movies-add', (req, res, next) => {
//     console.log('================================================');
//     console.log(req.params);
//     Movie.findById(req.body.id).then(movie => {
//         console.log(movie);
//         const { title, tmdbId, picture } = req.body;
//         const ownerId = req.user._id;
//         const newMovie = new Movie({
//             title,
//             tmdbId,
//             picture,
//             category: req.params.category,
//             _owner: ownerId
//         });
//         newMovie
//             .save()
//             .then(movie => {
//                 res.redirect('/'); // ?genre=' + req.body.genre
//             })
//             .catch(error => {
//                 console.log('ERROR', error);
//             });
//     });
// });

module.exports = router;
