const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Mongo Config
const db = require('./config/keys').mongoURI;

app.get('/', (req, res) => res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));