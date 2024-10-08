const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    Friends: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Assuming 'User' refers to another schema
    Posts: [] // Assuming 'User' refers to another schema
});

module.exports = mongoose.model('User', userSchema);
