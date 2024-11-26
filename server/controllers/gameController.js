const Game = require('../models/Game');

// Fetch all games
exports.getGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching games.' });
    }
};

// Fetch a specific game by ID
exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found.' });
        }
        res.status(200).json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching game.' });
    }
};

// Add a new game
exports.addGame = async (req, res) => {
    try {
        const { title, developer, genre, releaseDate } = req.body;

        // Validate input
        if (!title || !developer || !genre || !releaseDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newGame = new Game({ title, developer, genre, releaseDate });
        await newGame.save();

        res.status(201).json({ message: 'Game added successfully.', game: newGame });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding game.' });
    }
};
