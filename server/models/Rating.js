const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // User who submitted the rating
    },
    rating: {
        type: Number,
        required: true, // Numerical rating (e.g., 1–10)
        min: 0,
        max: 10,
    },
    review: {
        type: String, // Optional review text
        default: null,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
