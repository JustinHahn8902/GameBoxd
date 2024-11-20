const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Follow a user
router.post('/follow', async (req, res) => {
    const { followerId, followeeId } = req.body;

    try {
        // Ensure both users exist
        const follower = await User.findById(followerId);
        const followee = await User.findById(followeeId);

        if (!follower || !followee) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Avoid duplicate follows
        if (follower.following.includes(followeeId)) {
            return res.status(400).json({ error: 'Already following this user.' });
        }

        // Update following and followers
        follower.following.push(followeeId);
        followee.followers.push(followerId);

        await follower.save();
        await followee.save();

        res.status(200).json({ message: `You are now following ${followee.username}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;