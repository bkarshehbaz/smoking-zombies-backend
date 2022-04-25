const User = require('../models/user.model');
const logger = require('../../winston-config');

module.exports.getAllUsers = (req, res) => {
  User.find({}, '_id email checkedIn createdAt updatedAt', (err, users) => {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      res.status(500).json({
        status: false,
        message: 'some error occured',
        error: err,
      });
    }
    if (users) {
      res.status(200).json({ status: true, data: users });
    }
  });
};

module.exports.getOneUserByEmail = (req, res) => {
  User.findOne(
    { email: req.body.email },
    '_id email checkedIn createdAt updatedAt',
    (err, users) => {
      if (err) {
        logger.error(`DB Error: ${err.message}`);
        res.status(500).json({
          status: false,
          message: 'some error occured',
          error: err,
        });
      }
      if (users) {
        res.status(200).json({ status: true, data: users });
      }
    }
  );
};
