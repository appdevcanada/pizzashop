const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String, maxlength: 64, required: true },
  ipAddress: { type: String, maxlength: 64, required: true },
  createdAt: { type: Date, required: true }
})

const authentication_attempts = mongoose.model('Authentication', schema)

module.exports = authentication_attempts
