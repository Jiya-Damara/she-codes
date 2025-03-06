const mongoose = require('mongoose');


const ActivitySchema = new mongoose.Schema({
    name: String,
    duration: String,
    category: String,
  });
  

  module.exports = mongoose.model('Activity', ActivitySchema);