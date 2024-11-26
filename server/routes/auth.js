const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        res.status(200).json({ message: 'Login successful.', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

router.post('/update', async (req, res) => {
    const { username, followers, following } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.followers = followers;
        user.following = following;
        await user.save();

        res.status(200).json({ message: "Update successfully"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
})

router.get('/search', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        const users = await User.find({ username: new RegExp(username, 'i') }).limit(10);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;