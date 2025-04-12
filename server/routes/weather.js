const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;

router.get('/', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City name is required in query parameter' });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(apiUrl);
    const { main, weather, wind, name } = response.data;

    const weatherData = {
      city: name, // use name from API response for accuracy
      temperature: main.temp,
      condition: weather[0].main,
      description: weather[0].description,
      icon: `http://openweathermap.org/img/wn/${weather[0].icon}.png`,
      humidity: main.humidity,
      windSpeed: wind.speed,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: `Failed to fetch weather data for "${city}"` });
  }
});

module.exports = router;
