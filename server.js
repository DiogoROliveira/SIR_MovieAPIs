const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


app.get('/config', (req, res) => {
    res.json({
        TMDB_API_KEY: process.env.TMDB_API_KEY,
        YT_KEY: process.env.YT_KEY,
        RAPID_API_KEY: process.env.RAPID_API_KEY
    })
});

app.listen(PORT, () => {
    console.log("Server running");
});