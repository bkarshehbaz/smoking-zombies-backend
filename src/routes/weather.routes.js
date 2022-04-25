const express = require('express');

const router = express.Router();
const { ValidateJWT } = require('../services/utils');
const { getAllWeatherData } = require('../controllers/weather.controller');

router.get('/getAllWeatherData', ValidateJWT, getAllWeatherData);

module.exports = router;
