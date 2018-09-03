const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    picture: String, // poster_path
    tagline: String,
    releaseDate: String,
    rating: Number, //vote_average
    plot: String, //overview
    genres: Array,
    tmdbId: Number,
    votes: Number
});

const User = mongoose.model('User', userSchema);
module.exports = User;
