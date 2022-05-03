const express = require('express');

const router = express.Router();
const { ValidateJWT } = require('../services/utils');
const {
  getAllShopsData,
  createOneShop,
  updateShopData,
} = require('../controllers/shop.controller');

router.get('/getAllShopsData', ValidateJWT, getAllShopsData);

router.post('/createOneShop', ValidateJWT, createOneShop);

router.get('/updateOneShop', ValidateJWT, updateShopData);

router.get('/deleteOneShop', ValidateJWT, getAllShopsData);

module.exports = router;
