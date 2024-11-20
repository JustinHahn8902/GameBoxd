const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: String,
    genres: [String],
    release_date: Date
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;