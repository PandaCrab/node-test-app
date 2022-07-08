const express = require('express');
const router = express.Router();
const products = require('../services/products');

router.get('/', async (req, res, next) => {
    try {
        res.json(await products.getMultiple(req.query.page));
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        res.json(await products.create(req.body));
        console.log(req.body);
    } catch(err) {
        console.log(err.message);
        next(err);
    }
});

module.exports = router;
