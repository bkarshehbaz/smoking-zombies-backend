const mongoose = require('mongoose');
const logger = require('../../winston-config');

const weatherSchema = new mongoose.Schema(
  {
    currentWeather: {
      type: String,
      trim: true,
    },
    dailyWeather: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

weatherSchema.statics.insertOneWeatherData = function (field, cb) {
  this.create(field, function (err, result) {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      return cb(err);
    }
    if (!result) {
      return cb(null, null);
    }

    return cb(null, result);
  });
};

module.exports = new mongoose.model('Weather', weatherSchema);
