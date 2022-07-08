const express = require('express');
const cors = require('cors');
const productStorageRouter = require('./routes/productsStorage');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({ extended: true })
);

app.get('/', (req, res) => {
  res.json({ message: 'ok' })
});

app.use('/storage', productStorageRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
