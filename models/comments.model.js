const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  commentuserId: {
    type: String,
    required: true,
  },
  commentDescription: {
    type: String,
    required: true,
    unique: true,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = commentsSchema; // Export the schema, not the model
