const express = require('express');
const router = express.Router();
const { addReview, getReviewsByGame } = require('../controllers/reviewController');

// Add a new review for a game
router.post('/', addReview);

// Get reviews for a specific game
router.get('/:gameId', getReviewsByGame);

module.exports = router;
