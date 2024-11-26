const express = require('express');
const List = require('../models/List');
const User = require('../models/user');
const Game = require('../models/Game');

const router = express.Router();

// Create a new list
router.post('/', async (req, res) => {
    const { name, userId, isPublic } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const list = new List({ name, user: userId, isPublic });
        await list.save();

        user.lists.push(list._id);
        await user.save();

        return res.status(201).json(list);
    } catch (error) {
        console.error('Error creating list:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get list by User
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { requestingUserId } = req.query;

    try {
        let query = { user: userId };
        if (requestingUserId !== userId) {
            query.isPublic = true;
        }

        const lists = await List.find(query).populate('games');
        if (!lists || lists.length === 0) {
            return res.status(404).json({ error: 'Lists not found' });
        }

        return res.status(200).json(lists);
    } catch (error) {
        console.error('Error getting lists by user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Add a game to a list
router.post('/:listId/games', async (req, res) => {
    const { listId } = req.params;
    const { gameId } = req.body;

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        list.games.push(game._id);
        await list.save();

        return res.status(201).json(list);
    } catch (error) {
        console.error('Error adding game to list:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove a game from a list
router.delete('/:listId/games/:gameId', async (req, res) => {
    const { listId, gameId } = req.params;

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        list.games.pull(gameId);
        await list.save();

        return res.status(200).json(list);
    } catch (error) {
        console.error('Error removing game from list:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/:listId', async (req, res) => {
    const { listId } = req.params;

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        await List.findByIdAndDelete(listId);

        return res.status(200).json({ message: 'List successfully deleted' });
    } catch (error) {
        console.error('Error deleting list:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Set list as public or private
router.patch('/:listId', async (req, res) => {
    const { listId } = req.params;
    const { isPublic } = req.body;

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        list.isPublic = isPublic;
        await list.save();

        return res.status(200).json(list);
    } catch (error) {
        console.error('Error setting list visibility:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;