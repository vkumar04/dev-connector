const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

const app = express();

// Mongo Config
const db = require('./config/keys').mongoURI;

// connect to Mlab MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));