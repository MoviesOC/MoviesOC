const express = require('express');
const axios = require('axios');
const router = express.Router();

function randomNum(num) {
    return Math.ceil(Math.random() * num);
}

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/movie-suggestion', (req, res, next) => {
    let { genre } = req.query;
    // if (!genre) genre = '35'; // Default value

    let baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
    const apiKey = 'dc08a5c8305a1ec46c91df025d899797';
    let language = '&language=en-US';
    let noAdult = '&include_adult=false';
    let page = '&page=' + randomNum(1000);
    let comedyGenreId = '';
    if (genre) comedyGenreId = '&with_genres=' + genre;

    let movieUrl = ''.concat(baseUrl + apiKey + language + noAdult + page + comedyGenreId);

    axios
        .get(movieUrl)
        .then(response => {
            console.log('\n\n\n');
            console.log('-----------------------------------------');
            console.log(response.data.results[0].title);
            res.render('movie-comedy', {
                user: req.user,
                data: response.data,
                title: response.data.results[0].title
            });
        })
        .catch(err => {
            console.error(err);
        });
});

module.exports = router;
