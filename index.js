const express = require('express');
const cors = require('cors')
const db = require('./services/db');

const storage = db.productsStorage;

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.get('/storage', (req, res) => {
  res.json({ storage: storage });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});