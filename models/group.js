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
  //Id de los usuarios del grupo.
  users: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  }],
});

module.exports = mongoose.model('Group', GroupSchema);