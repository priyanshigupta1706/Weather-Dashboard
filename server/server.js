// server/server.js

const express = require('express');
const cors = require('cors');
const weatherRoute = require('./routes/weather');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/weather', weatherRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
