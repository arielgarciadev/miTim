const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userImage: {
    type: String,
    default: 'default.png'
  },
  //Id de los grupos del usuario.
  group: [{
    groupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    play: {
      type: String,
      default: 'idk',
    }
  }],
});

module.exports = mongoose.model('User', UserSchema);