const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    picture: String, // poster_path
    tmdbId: Number,
    category: {
        enum: ['like', 'hate', 'watched'],
        type: String
    },
    _owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
