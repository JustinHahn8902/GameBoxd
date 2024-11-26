const express = require('express');
const User = require('../models/User');
const List = require('../models/List'); // Assuming you have a List model
const mongoose = require('mongoose');

const router = express.Router();

router.post('/folUser', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User found successfully.', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
})

router.get('/search', async (req, res) => {
    const { username } = req.query;
    try {
        const users = await User.find({ username: { $regex: username, $options: 'i' } }).select(
            'username bio avatar'
        );
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching users.' });
    }
});

// Fetch lists (with games) for a specific user

router.get('/:userId/lists', async (req, res) => {
    const { userId } = req.params;

    try {
        // Validate the user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error(`Invalid user ID: ${userId}`);
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Fetch the user's lists
        const lists = await List.find({ user: userId }).populate('games');
        console.log(`Fetched lists for user ${userId}: ${JSON.stringify(lists, null, 2)}`);

        if (!lists.length) {
            console.warn(`No lists found for user ${userId}.`);
            return res.status(404).json({ error: 'No lists found' });
        }

        return res.status(200).json(lists);
    } catch (error) {
        console.error(`Error fetching lists for user ${userId}: ${error.message}`);
        return res.status(500).json({ error: 'Error fetching user lists' });
    }
});


module.exports = router;