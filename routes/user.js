const express = require('express');
const router = express.Router();
const { UserInfo, User } = require('../services/models');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await UserInfo.findOne({ _id: id });
        console.log(findUser)
        return res.send({
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            phone: findUser.phone,
            admin: findUser?.admin,
            age: findUser?.age,
            likes: findUser?.likes,
            shippingAddress: findUser.shippingAddress
        });
    } catch (err) {
        console.log(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateUser = await UserInfo.updateOne({ _id: id }, {$set: { shippingAddress: req.body }}, { new: true });

        // const findUser = await UserInfo.findOne({ _id: id});
console.log(updateUser);
        res.status(200).send({updated: updateUser, message: 'Information updated'});
    } catch (err) {
        console.log(err)
        res.send({ error: 'Somthing wrong' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await UserInfo.findOneAndDelete({ _id: id});
        console.log(deleteUser)

        res.status(200).send({ message: 'Account was deleted' });
    } catch (err) {
        console.log(err);
    }
});

router.get('/orders', async (req, res) => {
    try {
        const userOrders = await Order.find(req.body);

        return res.send(userOrders);
    } catch (err) {
        console.log(err);
    }
});
  
router.use('/order', async (req, res) => {
    try {
        const order = await Order.findOne(req.body);
        if (order.userId === req.body.userId) {
        return res.status(200).send(order);
        }
    } catch (err) {
        console.log(err);
    }
});
  
router.use('/likes', async (req, res) => {
    try {
        const userProfile = await UserInfo.findOne({ _id: req.body.userId });
        const findLike = userProfile.likes.find(element => element._id === req.body.like);

        if (findLike) {
            await UserInfo.updateOne({ _id: req.body.userId }, {$pull: {
                likes: { _id: req.body.like }
            }});

            res.send({ message: 'unlike' });
        }

        if (!findLike) {
            await UserInfo.updateOne({ _id: req.body.userId }, {$push: {
                likes: { _id: req.body.like }
            }});

            res.send({ message: 'like' });
        }

        return
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
