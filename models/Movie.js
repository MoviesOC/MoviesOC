const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    picture: String, // find key
    tagline: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
