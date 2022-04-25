const express = require('express');

const router = express.Router();
const auth_routes = require('./auth.routes');
const user_routes = require('./user.routes');
const shop_routes = require('./shop.routes');

// Auth routes
router.use('/auth', auth_routes);

// User Routes
router.use('/users', user_routes);

// Shop routes
router.use('/shops', shop_routes);

module.exports = router;
