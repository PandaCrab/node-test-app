const express = require('express');
const { isObjectIdOrHexString } = require('mongoose');
const router = express.Router();
const { UserInfo } = require('../services/models');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await UserInfo.findOne({ _id: id });

        return res.send({
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            phone: findUser.phone,
            admin: findUser?.admin,
            age: findUser?.age,
            likes: findUser?.likes,
            shippingAddress: findUser?.shippingAddress,
        });
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
                id: findUser._id,
                username: findUser.username,
                email: findUser.email,
                phone: findUser.phone,
                admin: findUser?.admin,
                likes: findUser.likes,
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
        const findLike = userProfile?.likes.find((element) => element._id === stuffId);

        if (findLike) {
            await UserInfo.updateOne(
                { _id: userId },
                {
                    $pull: {
                        likes: { _id: stuffId },
                    },
                }
            );

            res.send({ message: 'unlike' });
        }

        if (!findLike) {
            await UserInfo.updateOne(
                { _id: userId },
                {
                    $push: {
                        likes: { _id: stuffId },
                    },
                }
            );

            res.send({ message: 'like' });
        }

        return;
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
