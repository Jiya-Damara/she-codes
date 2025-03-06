const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: String,
  scheduledFor: Date,
  repeat: String,
  delivery: String,
});

module.exports = mongoose.model('Message', MessageSchema);
