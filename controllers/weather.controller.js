const axios = require('axios').default;
const Weather = require('../models/weather.model');
const logger = require('../../winston-config');

function getWeatherDataFromDB(res) {
  Weather.find({}, '_id currentWeather dailyWeather', (err, weatherData) => {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      res.status(500).json({
        status: false,
        message: 'some error occured',
        error: err,
      });
    }
    if (weatherData) {
      res.status(200).json({ status: true, data: weatherData });
    }
  });
}

function insertWeatherData(weatherData, res) {
  // logger.info(`Weather Data ${weatherData.currentWeatherCondition+" "+weatherData.dailyWeatherCondition}`);
  Weather.insertOneWeatherData(
    {
      currentWeather: weatherData.currentWeatherCondition,
      dailyWeather: weatherData.dailyWeatherCondition,
    },
    (err, result) => {
      if (err) {
        logger.error(`DB Error: ${err.message}`);
        res.status(500).json({
          status: false,
          message: 'some error occured',
          error: err,
        });
      } else {
        logger.info(`Weather Data inserted into database`);
      }
    }
  );
}

async function getWeatherFromAPI() {
  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/onecall?lat=22.2855&lon=114.1577&appid=236820a08a4539d96fd4f72df66f9d65'
    );
    const data = await response.data;
    if (!data) {
      logger.info(`weatherResult: ${data}`);
      return null;
    }
    return data;
  } catch (error) {
    logger.error(`Fetching Weather API error: ${error}`);
    return null;
  }
}

async function fetchWeatherData(res) {
  const weatherResult = await getWeatherFromAPI();
  if (weatherResult != null) {
    logger.info(`Getting weather data from API`);
    const currentWeatherCondition = weatherResult.current.weather[0].main;
    const dailyWeatherCondition = weatherResult.daily[0].weather[0].main;
    const weatherData = {
      currentWeatherCondition,
      dailyWeatherCondition,
    };
    insertWeatherData(weatherData, res);
    res.json(weatherData);
  } else {
    logger.info(`Getting weather data from database`);
    getWeatherDataFromDB(res);
  }
}

module.exports.getAllWeatherData = (req, res) => {
  fetchWeatherData(res);
};
