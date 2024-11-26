const express = require('express');
const Game = require('../models/Game');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const games = await Game.find({ name: new RegExp(name, 'i') }).limit(10);
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/popular', async (req, res) => {
    try {
        const games = await Game.find({ total_rating_count: { $gt: 100 } })
            .sort({ total_rating: -1 })
            .limit(25)
            .select('name cover_url igdb_id');
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/genre/:genre', async (req, res) => {
    const genre = req.params.genre;
    try {
        const games = await Game.find({ genres: new RegExp(genre, 'i') })
            .sort({ total_rating: -1 })
            .limit(25)
            .select('name cover_url igdb_id');
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ igdb_id: req.params.id });
        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }
        res.json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/similar', async (req, res) => {
    const { ids } = req.body;
    try {
        const games = await Game.find({ igdb_id: { $in: ids } });
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;