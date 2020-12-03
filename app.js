const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cities = require(`${__dirname}/api/cities/cities.json`);

app.use(express.static(`${__dirname}/frontend/build`));

app.get('/api/cities', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  let { query, limit } = req.query;

  if (!limit) {
    limit = 10;
  }

  const citiesByQuery = cities.filter(
    city => query.length &&
      city.name
      .toLowerCase()
      .slice(0, query.length) === query.toLowerCase()
  ).slice(0, limit);

  const formattedCities = citiesByQuery.map(city => ({
    value: city.id,
    label: `${city.name}, ${city.country}`
  }));

  res.send(formattedCities);
});

app.listen(PORT);
