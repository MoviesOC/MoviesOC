const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    picture: String, // poster_path
    tmdbId: String,
    category: {
        enum: ['like', 'hate', 'done'],
        type: String
    },
    _owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
