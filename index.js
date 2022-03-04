const express = require('express');
const app = express();
const PORT = process.env.PORT || 8800;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const characterRoute = require('./scrapers/characters');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
});

app.use(express.json());
app.use('/scraper/characters', characterRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
