const express = require('express');
const Game = require('../models/Game');

const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


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

router.post('/generate-description', async (req, res) => {
    const { description, images } = req.body;

    try {
        const prompt = `
        Title: ${description}

        Write an engaging, detailed game description for "${description}" in Markdown format with the following structure:
        1. A brief overview paragraph introducing the game, its genre, and its setting.
        2. A detailed paragraph about gameplay mechanics, missions, or story elements.
        3. A section with bullet points summarizing the game's standout features (e.g., graphics, multiplayer modes, etc.).
        4. A final paragraph summarizing the overall experience and why players should try it.
        
        Use these images as inspiration for the description:
        ${images.map((image, index) => `Image ${index + 1}: ${image}`).join('\n')}
        
        Ensure proper Markdown formatting with paragraphs and bullet points.
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Use GPT-4o for efficiency and cost
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800, // Adjust tokens as needed
        });

        res.json({ enhancedDescription: response.choices[0].message.content });
    } catch (error) {
        console.error("Generating enhanced description...", error.message || error.response || error);
        res.status(500).json({ error: 'Failed to generate description', details: error.message });
    }
});


module.exports = router;