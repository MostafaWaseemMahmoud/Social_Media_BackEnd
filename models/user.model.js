const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post schema
const postSchema = new Schema({
    _id: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    postTitle: { type: String, required: true },
    postDescription: { type: String },
    comments: [{ type: String }],
    likes: { type: Number, default: 0 },  // Correct definition for 'likes' as a Number
});


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    posts: [postSchema],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Ensure friends is an array of ObjectIds
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
