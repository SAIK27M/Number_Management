const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;
const TIMEOUT = 500;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  const uniqueNumbers = new Set();

  const requests = urls.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: TIMEOUT });
      if (response.status === 200 && response.data && Array.isArray(response.data.numbers)) {
        response.data.numbers.forEach((number) => uniqueNumbers.add(number));
      }
    } catch (error) {
      // Ignore URLs that take too long to respond or encounter other errors
    }
  });

  await Promise.all(requests);

  const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
  const responseObj = { numbers: sortedNumbers };
  res.json(responseObj);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});