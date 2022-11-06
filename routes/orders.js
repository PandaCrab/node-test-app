const express = require('express');

const router = express.Router();
const { Order, Product } = require('../services/models');

router.post('/create', async (req, res) => {
    try {
        const productIds = req.body.orderInfo.products.map((product) => product._id);
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        const quantityAvailable = products.map((product) => {
            const productInOrder = productIds.filter((el) => el === product._id.toString());

            if (productInOrder.length) {
                if (product.quantity >= productInOrder.length) {
                    return {
                        id: product._id,
                        orderedQuantity: productInOrder.length,
                    };
                }
            }

            return null;
        });

        if (!quantityAvailable.includes(null)) {
            const newOrder = new Order({ ...req.body });
            const insertedOrder = await newOrder.save();

            if (insertedOrder) {
                quantityAvailable.forEach(async (ordered) => {
                    await Product.findOneAndUpdate({ _id: ordered.id }, {
                        quantity: products.filter(
                            (e) => e._id === ordered.id,
                        )[0].quantity - ordered.orderedQuantity,
                    });
                });

                return res.status(201).json({ orderId: insertedOrder.orderId });
            }
        }

        return res.status(403)
            .json({ message: 'Sorry, a quantity of the product is not much in store for Your order' });
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
        const order = await Order.findOne({ orderId: id });

        if (order.userId === req.body.userId) {
            return res.status(200).send(order);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
