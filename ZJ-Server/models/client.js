const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  ID: Number,
  proxy: String,
  pass: String,
  credit: {
    type: Number,
    default: 0
  },
  block: {
    type: Boolean,
    default: 0
  },
  attackFrequency: {
    type: Number,
    default: 0
  },
  attackStrength: {
    type: Number,
    default: 0
  },
  accessTime: Date,
  logoutTime: Date,
  timeSlot: {
    type: Number,
    default: 0
  },
  spy: {
    type: Boolean,
    default: false
  }, 
});

module.exports = mongoose.model('Client', ClientSchema);