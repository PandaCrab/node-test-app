const express = require('express');

const router = express.Router();
const { UserInfo } = require('../services/models');

const { toUpperFirstLetter } = require('../utils');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await UserInfo.findOne({ _id: id });

        return res.send({
            _id: findUser._id,
            username: toUpperFirstLetter(findUser.username),
            photo: findUser.photo,
            email: findUser.email,
            phone: findUser.phone,
            admin: findUser.admin,
            age: findUser.age,
            likes: findUser.likes,
            shippingAddress: findUser.shippingAddress,
            rated: findUser.rated,
        });
    } catch (err) {
        console.log(err);
    }
});

router.put('/:_id/setAvatar', async (req, res) => {
    try {
        const { _id } = req.params;

        await UserInfo.findOneAndUpdate({ _id }, {
            photo: req.body.avatar,
        });

        return res.send({ message: 'Avatar is added' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

router.put('/ratedProduct', async (req, res) => {
    try {
        const { userId, ratedProduct } = req.body;

        const userProfile = await UserInfo.findOne({ _id: userId }).lean();
        const findRatedProduct = await userProfile.rated.find((element) => element.productId === ratedProduct.id);
        if (Object.keys(userProfile).includes('rated') && !findRatedProduct) {
            const updated = await UserInfo.findOneAndUpdate({ _id: userId }, {
                $push: {
                    rated: {
                        productId: ratedProduct.id,
                        rated: ratedProduct.rated,
                    },
                },
            }, {
                new: true,
            });

            return res.send(updated);
        }

        if (!Object.keys(userProfile).includes('rated')) {
            const updated = await UserInfo.findOneAndUpdate({ _id: userId }, {
                rated: {
                    productId: ratedProduct.id,
                    rated: ratedProduct.rated,
                },
            }, {
                new: true,
            });

            return res.send(updated);
        }
    } catch (err) {
        console.log(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await UserInfo.updateOne({ _id: id }, req.body, { upsert: true });

        const findUser = await UserInfo.findOne({ _id: id });

        res.status(200).send({
            updated: {
                _id: findUser._id,
                username: toUpperFirstLetter(findUser.username),
                email: findUser.email,
                phone: findUser.phone,
                photo: findUser.photo,
                admin: findUser.admin,
                likes: findUser.likes,
                rated: findUser.rated,
                age: findUser.age,
                shippingAddress: findUser.shippingAddress,
            },
            message: 'Information updated',
        });
    } catch (err) {
        console.log(err);
        res.send({ error: 'Somthing wrong' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const checkUser = await UserInfo.findOne({ _id: id });

        if (checkUser.password === req.body.password) {
            const deleteUser = await UserInfo.findOneAndDelete({ _id: id });

            if (deleteUser) {
                res.status(200).send({ message: 'Account was deleted' });
            }
        } else {
            res.send({ error: 'Incorrect password' });
        }
    } catch (err) {
        console.log(err);
    }
});

router.put('/', async (req, res) => {
    try {
        const { userId, stuffId } = req.body;

        const userProfile = await UserInfo.findOne({ _id: userId });
        const findLike = userProfile.likes.find((element) => element._id === stuffId);

        if (findLike) {
            await UserInfo.updateOne({ _id: userId }, {
                $pull: {
                    likes: { _id: stuffId },
                },
            });

            res.send({ message: 'unlike' });
        }

        if (!findLike) {
            await UserInfo.updateOne({ _id: userId }, {
                $push: {
                    likes: { _id: stuffId },
                },
            });

            res.send({ message: 'like' });
        }

        return;
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
