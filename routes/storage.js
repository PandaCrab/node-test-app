const express = require('express');

const router = express.Router();
const { Product } = require('../services/models');

router.get('/', async (req, res) => {
    try {
        const allProducts = await Product.find().lean();

        return res.status(200).send(allProducts);
    } catch (error) {
        console.log(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const ids = req.body;

        const products = await Product.find({ _id: { $in: ids } }).lean();

        return res.send(products);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        return res.send(product);
    } catch (err) {
        console.log(err);
    }
});

router.get('/categories/:category', async (req, res) => {
    try {
        const { category } = req.params;

        if (category) {
            const products = await Product.find({ category });

            return res.send(products);
        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/categories/:category/:subcategory', async (req, res) => {
    try {
        const { category, subcategory } = req.params;

        if (category && subcategory) {
            const subProducts = await Product.find({ subcategory });

            return res.send(subProducts);
        }

        if (!subcategory && category) {
            const products = await Product.find({ category });

            return res.send(products);
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body.lenght) {
            const ids = req.body.map((id) => id._id);
            const someProducts = await Product.find({ _id: { $in: ids } });

            return res.send(someProducts);
        }

        const newProduct = new Product({ ...req.body });
        await newProduct.save();

        return res.status(201).json({ message: 'Product was created' });
    } catch (err) {
        console.log(err);
    }
});

router.post('/create', async (req, res) => {
    try {
        const newProduct = new Product({ ...req.body });
        await newProduct.save();

        return res.status(201).json({ message: 'Product was created' });
    } catch (err) {
        console.log(err);
    }
});

router.delete('/', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete(req.body);

        return res.status(200).send({ message: `Product "${deletedProduct.name}" has been removed from storage` });
    } catch (err) {
        console.log(err);
    }
});

router.put('/', async (req, res) => {
    const { _id } = req.body;
    const notUpdated = await Product.findOne({ _id }).lean();

    const sameValues = Object.keys(notUpdated)
        .filter((key) => key !== '_id' && key !== '__v' && key !== 'stars' && key !== 'comments')
        .every((key) => notUpdated[key] === req.body[key]);

    try {
        if (sameValues) {
            return res.status(304).send({ error: 'Information not changed for update' });
        }

        if (!sameValues) {
            await Product.updateOne({ _id }, req.body);

            const product = await Product.findOne({ _id });

            return res.status(201).send({ message: `Information about "${product.name}" has been updated` });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
