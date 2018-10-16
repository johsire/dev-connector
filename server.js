const express = require('express');
const mongoose = require('mongoose');

const app = express();

// DB Config:
const db = require('./config/keys').mongoURI;

// Connect to MongoBD Using Mongoose;
mongoose
      .connect(db, { useNewUrlParser: true })
      .then(() => console.log('MongoDB Connected'))
      .catch(err => console.log(err, 'MongoDB Error!'))

app.get('/', (req, res) => res.send('Hello Utah!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
