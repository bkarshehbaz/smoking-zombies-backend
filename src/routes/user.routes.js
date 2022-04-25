const express = require('express');

const router = express.Router();
const { ValidateJWT } = require('../services/utils');
const {
  getAllUsers,
  getOneUserByEmail,
} = require('../controllers/user.controller');

router.get('/getAllUsers', ValidateJWT, getAllUsers);

router.get('/getOneUserByEmail', ValidateJWT, getOneUserByEmail);

module.exports = router;
