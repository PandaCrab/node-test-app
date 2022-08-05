const express = require('express');
const router = express.Router();
const { Order } = require('../services/models');

router.post('/create', async (req, res) => {
    try {
        const newOrder = new Order({ ...req.body });
        const insertedOrder = await newOrder.save();

        return res.status(201).json({orderId: insertedOrder.orderId})
    } catch (err) {
        console.log(err);
    }
});

router.post('/userOrders', async (req, res) => {
    try {
        const userOrders = await Order.find(req.body);

        return res.send(userOrders);
    } catch (err) {
        console.log(err);
    }
});
  
router.post('/userOrders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({orderId: id});

        if (order.userId === req.body.userId) {
            return res.status(200).send(order);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
