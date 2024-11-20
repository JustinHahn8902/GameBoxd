const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Unfollow a user
router.delete('/unfollow', async (req, res) => {
    const { followerId, followeeId } = req.body;

    try {
        const follower = await User.findById(followerId);
        const followee = await User.findById(followeeId);

        if (!follower || !followee) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Ensure the user is currently following
        if (!follower.following.includes(followeeId)) {
            return res.status(400).json({ error: 'Not following this user.' });
        }

        // Update following and followers
        follower.following = follower.following.filter(id => id.toString() !== followeeId);
        followee.followers = followee.followers.filter(id => id.toString() !== followerId);

        await follower.save();
        await followee.save();

        res.status(200).json({ message: `You have unfollowed ${followee.username}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;