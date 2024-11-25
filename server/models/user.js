const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const List = require('./List')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: '',
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fs.files',
        default: null,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
    }],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const defaultLists = ['Played', 'Currently Playing', 'Want to Play'];
        const lists = await Promise.all(defaultLists.map(async (name) => {
            const list = new List({ name, user: this._id });
            await list.save();
            return list._id;
        }));
        this.lists = lists;
    }
    next();
})

userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;