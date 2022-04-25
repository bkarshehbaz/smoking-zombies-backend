const CheckInRecord = require('../models/checkInRecord.model');
const Shop = require('../models/shop.model');

const logger = require('../../winston-config');

module.exports.performCheckIn = (req, res) => {
  const checkInRecord = new CheckInRecord(req.body);
  /* 
     1. get shop object (include shopId, shopName, long lat) by shop name (from QR)
     2. get current user Id and email (by token?) as an object and put it into check in record
     3. put current timestamp into check in record
     4. mark a pin according to shop's long lat on openstreetmap
    */

  // 1. get shop object (include shopId, shopName, long lat) by shop name (from QR)
  Shop.find({ name: req.body.name }, function (err, shop) {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      res.status(500).json({
        status: false,
        message: 'some error occured',
        error: err,
      });
    }
    if (shop) {
      res.status(200).json({ status: true, data: shop });
    }
  });

  // 2. get current user Id and email (by token?) as an object and put it into check in record

  // 3. put current timestamp into check in record

  // 4. put current timestamp into check in record
  checkInRecord.save((er, new_user) => {
    if (er) {
      logger.error(`DB Error: ${er.message}`);
      res.status(500).json({
        status: false,
        message: 'error creating new User',
        error: er,
      });
    }
    res.status(201).json({ status: true, new_user });
  });
  
};

module.exports.getAllCheckInRecords = (req, res) => {
  CheckInRecord.find(
    {},
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

module.exports.getOneRecord = (req, res) => {
  CheckInRecord.findOne(
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
