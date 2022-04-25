const axios = require('axios').default;
const Shop = require('../models/shop.model');
const logger = require('../../winston-config');

function getShopDataFromDB(res) {
  Shop.find({}, function (err, ShopData) {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      res.status(500).json({
        status: false,
        message: 'some error occured',
        error: err,
      });
    }
    if (ShopData) {
      res.status(200).json({ status: true, data: ShopData });
    }
  });
}

module.exports.getAllShopsData = (req, res) => {
  getShopDataFromDB(res);
};

function createOneShop(req, res) {
  logger.info(`Shop Data ${req}`);

  const shop = new Shop(req.body);

  shop.save((er, new_shop) => {
    if (er) {
      logger.error(`DB Error: ${er.message}`);
      res.status(500).json({
        status: false,
        message: 'error creating new shop',
        error: er,
      });
    }
    res.status(201).json({ status: true, new_shop });
  });
}

module.exports.createOneShop = (req, res) => {
  createOneShop(req, res);
};

async function getShopFromAPI() {
  try {
    const response = await axios.get(
      'https://api.openShopmap.org/data/2.5/onecall?lat=22.2855&lon=114.1577&appid=236820a08a4539d96fd4f72df66f9d65'
    );
    const data = await response.data;
    if (!data) {
      logger.info(`ShopResult: ${data}`);
      return null;
    }
    return data;
  } catch (error) {
    logger.error(`Fetching Shop API error: ${error}`);
    return null;
  }
}

async function fetchShopData(res) {
  const ShopResult = await getShopFromAPI();
  if (ShopResult != null) {
    logger.info(`Getting Shop data from API`);
    const currentShopCondition = ShopResult.current.Shop[0].main;
    const dailyShopCondition = ShopResult.daily[0].Shop[0].main;
    const ShopData = {
      currentShopCondition,
      dailyShopCondition,
    };
    createOneShop(ShopData, res);
    res.json(ShopData);
  } else {
    logger.info(`Getting Shop data from database`);
    getShopDataFromDB(res);
  }
}

module.exports.getAllShopDataViaThirdPartyAPI = (req, res) => {
  fetchShopData(res);
};
