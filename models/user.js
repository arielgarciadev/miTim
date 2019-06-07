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
  userImage: {
    type: String,
    default: 'default.png'
  },
  lastGroup: {
    type: String,
    default: ''
  },
  score: [{
    type: Number,
    dafault: ""
  }]
})

module.exports = mongoose.model('User', UserSchema);