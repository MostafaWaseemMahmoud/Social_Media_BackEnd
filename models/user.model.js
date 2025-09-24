const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post schema
const commentSchema = require('./comments.schema');


const likeSchema = new mongoose.Schema({
  likeuserId: {
    type: String,
  },
});

const postsSchema = new mongoose.Schema({
    id: {type:String,unique:true},
  postTitle: {
    type: String,
    required: true,
  },
  postDescription: {
    type: String,
    required: true,
    unique: true,
  },
  mediaUrl: {
    type: String,
    required: false,
    default: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIALsBTQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIG/9oACAEBAAAAAOaAoAAABAACgAAAIAAKAAAAgAAoAAABAACgAAAIAACgAABAAAoAAACAAAoAAAgAABQAACACUAKAAAgAAAKAAgAAAAoAEAAAAAFCAAAAAAUgAACKAAAAAAgKAAAAAECgAAAAAICgAAAAEACgAAAAQAAUAAAIAAFAAAAgAAoAAAEAAAAUAgAAayAAAAAAH//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAKAgIQAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAYEAEAAwEAAAAAAAAAAAAAAAACIVBxkP/aAAgBAQABPwDuMoS2q//EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQIBAT8AfP/EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQMBAT8AfP/Z",
  },

  comments: [commentSchema], // ✅ هذا هو التصليح النهائي

  likes: [likeSchema],

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});




const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    posts: [postsSchema],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Ensure friends is an array of ObjectIds
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
