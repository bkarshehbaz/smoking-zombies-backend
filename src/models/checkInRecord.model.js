const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    shopData: {
      type: Object,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    checkInTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model('checkInRecord', checkInSchema);
