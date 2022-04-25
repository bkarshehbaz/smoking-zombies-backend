const express = require('express');

const router = express.Router();
const { ValidateJWT } = require('../services/utils');
const {
  getAllShopsData,
  createOneShop,
} = require('../controllers/shop.controller');

router.get('/getAllShopsData', ValidateJWT, getAllShopsData);

router.post('/createOneShop', ValidateJWT, createOneShop);

router.get('/updateAShop', ValidateJWT, getAllShopsData);

router.get('/deleteAShop', ValidateJWT, getAllShopsData);

module.exports = router;
