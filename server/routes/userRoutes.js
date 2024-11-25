const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Setup MongoDB connection
const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Initialize GridFS
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('avatars');
});

// Storage engine for multer and GridFS
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: `${req.body.username}-avatar-${Date.now()}`,
            bucketName: 'avatars',
        };
    },
});
const upload = multer({ storage });

// Define user schema with bio field
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    bio: { type: String },
});

const User = mongoose.model('User', userSchema);

// Initialize router
const router = express.Router();

// Save bio endpoint
router.post('/user/bio', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).json({ message: 'Username and bio are required.' });
    }

    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, bio });
        } else {
            user.bio = bio;
        }

        await user.save();
        res.status(200).json({ message: 'Bio saved successfully.', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving bio.' });
    }
});

// Save avatar endpoint
router.post('/user/avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Avatar file is required.' });
    }

    res.status(200).json({
        message: 'Avatar uploaded successfully.',
        fileId: req.file.id,
    });
});

// Export the router
module.exports = router;
