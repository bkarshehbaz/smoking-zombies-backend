const mongoose = require('mongoose');

const UserCheckIns = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  time: {
    type: String,
  },
  instagram: {
    type: String,
  },
  logo: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const CheckIns = mongoose.model('CheckIns', UserCheckIns);

module.exports = CheckIns;
