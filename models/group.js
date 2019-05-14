const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'play',
  },
  date: {
    type: String,
  },
  place: {
    type: String,
  },
  note: {
    type: String,
    default: '',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  raters: [{
    type: String,
  }],
  //Id de los usuarios del grupo.
  users: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    response: {
      type: String,
      default: 'idk',
    },
  }],
});

module.exports = mongoose.model('Group', GroupSchema);