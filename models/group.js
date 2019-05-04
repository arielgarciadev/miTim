const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mode: {
    type: String,
  },
  date: {
    type: String,
  },
  place: {
    type: String,
  },
  note: {
    type: String,
  },
  users: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String,
      default: ''
    }
  }],
});

module.exports = mongoose.model('Group', GroupSchema);