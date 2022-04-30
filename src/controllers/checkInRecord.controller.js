const CheckInRecord = require('../models/checkInRecord.model');
const Shop = require('../models/shop.model');

const logger = require('../../winston-config');

async function performCheckIn(req, res) {
  /* 
     1. get shop object (include shopId, shopName, long lat) by shop name (from QR)
     2. current email and username provided by frontend 
     3. put current timestamp into check in record
    */
  // 1. get shop object (include shopId, shopName, long lat) by shop name (from QR)
  let shopData = null;
  try {
    this.shopData = await Shop.find({ name: req.body.shopName });
  } catch (err) {
    logger.error(`DB Error: ${err.message}`);
    res.status(500).json({
      status: false,
      message: 'some error occured',
      error: err,
    });
  }
  logger.info('shopData');
  logger.info(this.shopData);

  // 2. get current email and username (via login api at frontend)

  // 3. put current timestamp into check in record
  const currentTime = Date.now();
  logger.info(`current time: ${currentTime}`);

  // 4. put current timestamp into check in record
  const output = {
    shopData: this.shopData[0],
    userData: req.body.userData,
    checkInTime: currentTime,
  };

  const checkInData = new CheckInRecord(output);

  checkInData.save((er, newCheckIn) => {
    if (er) {
      logger.error(`DB Error: ${er.message}`);
      res.status(500).json({
        status: false,
        message: 'error creating new check in record',
        error: er,
      });
    }
    res.status(201).json({ status: true, newCheckIn });
  });
}

module.exports.checkIn = (req, res) => {
  performCheckIn(req, res);
};

async function performGetAllCheckInRecords(req, res) {
  let checkInRecords = null;
  try {
    this.checkInRecords = await CheckInRecord.find({});
  } catch (err) {
    logger.error(`DB Error: ${err.message}`);
    res.status(500).json({
      status: false,
      message: 'some error occured',
      error: err,
    });
  }
  if (this.checkInRecords) {
    res.status(200).json({ status: true, data: this.checkInRecords });
  }
}

module.exports.getAllCheckInRecords = (req, res) => {
  performGetAllCheckInRecords(req, res);
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
