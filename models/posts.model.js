const mongoose = require('mongoose');
const commentsSchema = require('./comments.model');

const postsSchema = new mongoose.Schema({
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

  comments: [commentsSchema],
  likes: {
    type:Number,
    required: false,
    default: 0,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = postsSchema; // Export the schema, not the model
