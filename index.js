const express = require('express');
const cors = require('cors');
const { main } = require('./services/db');

const { Product } = require('./services/models');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/storage', async (req, res) => {
  try {
      const allProducts = await Product.find().lean();
      return res.status(200).json(allProducts);
  } catch (error) {
      console.log(error.message);
  }
});

app.post('/storage', async (req, res) => {
  try {
    const newProduct = new Product({ ...req.body });
    const insertedProduct = await newProduct.save();
    return res.status(201).json(insertedProduct);
  } catch (err) {
    console.log(err)
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

const start = async () => {
  try {
    await main();
    
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch(err) {
    console.log(err);

    process.exit(1);
  }
};

start();
