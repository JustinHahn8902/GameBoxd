const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    }],
    isPublic: { type: Boolean, default: true },
})

const List = mongoose.model('List', listSchema);

module.exports = List;