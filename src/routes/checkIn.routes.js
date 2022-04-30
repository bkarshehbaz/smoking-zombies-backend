const express = require('express');

const router = express.Router();
const { ValidateJWT } = require('../services/utils');
const {
  checkIn,
  getAllCheckInRecords,
} = require('../controllers/checkInRecord.controller');

router.post('/performCheckIn', ValidateJWT, checkIn);

router.get('/getAllCheckInRecords', ValidateJWT, getAllCheckInRecords);

module.exports = router;
