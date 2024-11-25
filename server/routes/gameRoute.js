const express = require('express');
const router = express.Router();
const { getGames, getGameById, addGame } = require('../controllers/gameController');

// Fetch all games
router.get('/', getGames);

// Fetch a specific game by ID
router.get('/:id', getGameById);

// Add a new game (admin-only functionality)
router.post('/', addGame);

module.exports = router;
