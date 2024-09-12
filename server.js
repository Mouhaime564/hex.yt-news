const express = require('express');
const request = require('request');
const cors = require('cors');  // Ensure CORS is included
const app = express();

app.use(cors());  // Use CORS to avoid CORS issues

app.get('/fetch_feed', (req, res) => {
    const url = req.query.url;
    request(url).pipe(res);
});

app.listen(3000, () => {
    console.log('Proxy server running at http://localhost:3000');
});
