const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password']
  },
  avatar: {
    public_id: String,
    url: String
  },
  tokenHash: {
    type: String,
    required: true
  },
  tokenExpire: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Verification', verificationSchema);
