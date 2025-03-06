const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['guided', 'unguided', 'breathing', 'body-scan', 'loving-kindness'],
    default: 'unguided',
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meditation', MeditationSchema);
