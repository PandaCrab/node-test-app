const express = require('express');
const router = express.Router();
const { Product } = require('../services/models');

router.put('/:_id/rating', async (req, res) => {
    const { _id } = req.params;
    const { rated } = req.body;

    const product = await Product.findOne({ _id }).lean();
console.log(req.params, req.body)
    if (Object.keys(product).includes('stars')) {
        const { stars } = product;

        const updatedRating = {
            five: rated === 5 ? stars.five + 1 : stars.five,
            four: rated === 4 ? stars.four + 1 : stars.four,
            three: rated === 3 ? stars.three + 1 : stars.three,
            two: rated === 2 ? stars.two + 1 : stars.two,
            one: rated === 1 ? stars.one + 1 : stars.one
        };

        await Product.updateOne({ _id }, { stars: updatedRating });
    };

    if (!Object.keys(product).includes('stars')) {
        const updatedRating = { 
            five: rated === 5 ? 1 : 0,
            four: rated === 4 ? 1 : 0,
            three: rated === 3 ? 1 : 0,
            two: rated === 2 ? 1 : 0,
            one: rated === 1 ? 1 : 0
        }; 

        await Product.updateOne({ _id }, {stars: updatedRating});
    }
});

module.exports = router;
