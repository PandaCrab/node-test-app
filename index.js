const express = require('express');
const cors = require('cors');
const { main } = require('./services/db');

const { Product, User, Registration, UserInfo, Order } = require('./services/models');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/storage', async (req, res) => {
  try {
      const allProducts = await Product.find().lean();
      return res.status(200).send(allProducts);
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
    console.log(err);
  }
});

app.delete('/storage', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete(req.body);
    
    return res.status(200).send({ message: `Product ${deletedProduct.name} was remove from storage` });
  } catch (err) {
    console.log(err);
  }
});

app.use('/users', async (req, res) => {
  try {
    const findUser = await UserInfo.findOne(req.body);
      return res.send({
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
        phone: findUser.phone,
        admin: findUser?.admin,
        age: findUser?.age
      });
  } catch (err) {
    console.log(err);
  }
});

app.use('/auth', async (req, res) => {
  try {
    const findUser = await User.findOne(req.body);
    
    if (findUser && req.body.password === findUser.password) {
      res.send({
        token: findUser._id,
        user: {
          id: findUser._id,
          emai: findUser.email,
          username: findUser.username,
          phone: findUser.phone,
          admin: findUser.admin,
          age: findUser.age
        },
        message: 'Ok'
      });
    } else {
      res.send({
        token: '',
        message: 'Incorrect name or password'
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order({ ...req.body });
    const insertedOrder = await newOrder.save();

    return res.status(201).json({orderId: insertedOrder.orderId})
  } catch (err) {
    console.log(err);
  }
});

app.use('/userOrders', async (req, res) => {
  try {
    const userOrders = await Order.find(req.body);
    console.log(req.body)

    return res.send(userOrders);
  } catch (err) {
    console.log(err);
  }
});

app.use('/userOrder', async (req, res) => {
  try {
    const order = await Order.findOne(req.body);
    if (order.userId === req.body.userId) {
      return res.status(200).send(order);
    }
  } catch (err) {
    console.log(err);
  }
});

app.use('/registration', async (req, res) => {
  try {
    const isBusy = await User.findOne(req.body);
    const body = req.body;

    if (!isBusy) {
      const newUser = new Registration({ ...req.body });
      const insertUser = await newUser.save();

      return res.send({
        token: insertUser._id,
        user: {
          id: insertUser._id,
          email: insertUser.email,
          username: insertUser.username,
          age: insertUser.age,
          address: insertUser.address
        },
        message: 'ok'
      })
    } 
    
    if (isBusy.email && body.email === isBusy.email) {
      return res.send('Email alredy exists');
    }

    return res.send('Somthing wrong');
  } catch (err) {
    console.log(err);
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
