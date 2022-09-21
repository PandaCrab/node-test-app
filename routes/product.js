const express = require('express');

const router = express.Router();
const { Product } = require('../services/models');

const { starRating } = require('../utils');

router.put('/:_id/rating', async (req, res) => {
    const { _id } = req.params;
    const { rated } = req.body;

    const product = await Product.findOne({ _id }).lean();

    const updatedRating = await starRating(product, rated);

    await Product.updateOne({ _id }, { stars: updatedRating }, { new: true });

    const updatedProducts = await Product.find().lean();

    return res.send(updatedProducts);
});

router.put('/:_id/addComments', async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await Product.findOne({ _id }).lean();

        if (Object.keys(product).includes('comments')) {
            const updated = await Product.findOneAndUpdate({ _id }, {
                $push: {
                    comments: req.body,
                },
            }, {
                new: true,
            });
            return res.send(updated);
        }

        if (!Object.keys(product).includes('comments')) {
            const updated = await Product.findOneAndUpdate({ _id }, {
                comments: [req.body],
            }, {
                new: true,
            });

            res.send(updated);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
