const express = require('express');
const User = require('../models/User');

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

module.exports = router;