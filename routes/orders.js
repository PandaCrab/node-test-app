const express = require('express');
const router = express.Router();
const { Order } = require('../services/models');

router.post('/orders', async (req, res) => {
    try {
        const newOrder = new Order({ ...req.body });
        const insertedOrder = await newOrder.save();

        return res.status(201).json({orderId: insertedOrder.orderId})
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
