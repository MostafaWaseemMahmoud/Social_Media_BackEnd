const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    Friends: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Self-referencing 'User' schema for friends
    Posts: [{
        mediaUrl,
        postTitle,
        postDescription, 
        likes,
        comments 
    }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
