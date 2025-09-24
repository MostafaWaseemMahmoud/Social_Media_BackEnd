const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentDescription: {
    type: String,
  },
  commentuserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = commentSchema;