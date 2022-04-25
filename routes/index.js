const express = require('express');

const router = express.Router();
const auth_routes = require('./auth.routes');
const user_routes = require('./user.routes');
const weather_routes = require('./weather.routes');

// Auth routes
router.use('/auth', auth_routes);

// User Routes
router.use('/user', user_routes);

// Weather routes
router.use('/weather', weather_routes);

module.exports = router;
