const express = require('express');

const router = express.Router();
const auth_routes = require('./auth.routes');
const user_routes = require('./user.routes');
const shop_routes = require('./shop.routes');
const check_in_routes = require('./checkIn.routes');

// Auth routes
router.use('/auth', auth_routes);

// User Routes
router.use('/users', user_routes);

// Shop routes
router.use('/shops', shop_routes);

// Check In routes
router.use('/checkIn', check_in_routes);

module.exports = router;
