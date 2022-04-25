const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    shopId: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
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
