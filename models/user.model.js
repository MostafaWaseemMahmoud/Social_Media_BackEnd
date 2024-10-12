const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    posts: {
        type: Array,
        default: [] // Ensure the default value is an empty array
    }, // Changed to "posts"
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Self-referencing 'User' schema for friends
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
