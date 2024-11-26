const express = require('express');
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const User = require('../models/user');
const Game = require('../models/Game');

const { ObjectId } = mongoose.Types;

const router = express.Router();

router.get('/user-rating/:userId/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;

    try {
        const game = await Game.findOne({ igdb_id: gameId });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const rating = await Rating.findOne({ userId, gameId: game._id });

        res.json({ gameId, rating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the rating' });
    }
});

router.post('/user-rating/:userId/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;
    const { rating, review } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const game = await Game.findOne({ igdb_id: gameId });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        if (typeof rating !== 'number' || rating < 0 || rating > 10) {
            return res.status(400).json({ error: 'Rating must be a number between 0 and 10' });
        }

        const updatedRating = await Rating.findOneAndUpdate(
            { userId, gameId: game._id },
            { rating, review: review || null },
            { upsert: true, new: true } // Create if not found, return the updated doc
        );

        res.json({
            message: 'Rating updated successfully',
            gameId,
            rating: updatedRating,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the rating' });
    }
});

router.get('/reviews/:gameId', async (req, res) => {
    const { gameId } = req.params;

    try {
        const game = await Game.findOne({ igdb_id: gameId });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // Find all ratings for the game where a review exists
        const reviews = await Rating.find({ gameId: game._id, review: { $ne: null } }).populate('userId', 'username');

        // Return the ratings
        res.json({ gameId: game._id, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving ratings with reviews' });
    }
});

module.exports = router;
