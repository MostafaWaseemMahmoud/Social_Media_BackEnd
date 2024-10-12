const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    Friends: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Self-referencing 'User' schema for friends
    Posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }] // Assuming there is a 'Post' schema
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
