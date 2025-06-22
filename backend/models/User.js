const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  votedRoles: {
    type: Map,
    of: Boolean,
    default: {}
  }
});

module.exports = mongoose.model('User', userSchema);