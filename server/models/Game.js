const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    igdb_id: Number,
    name: String,
    genres: [String],
    release_date: Date,
    cover_url: String,
    screenshot_urls: [String],
    similar_games: [Number],
    total_rating: Number,
    total_rating_count: Number,
    summary: String,
    website_urls: [String],
    platforms: [String]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;