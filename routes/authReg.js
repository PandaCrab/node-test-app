const express = require('express');

const router = express.Router();
const { User, Registration } = require('../services/models');

const { toUpperFirstLetter } = require('../utils');

router.use('/auth', async (req, res) => {
    try {
        const findUser = await User.findOne(req.body);

        if (findUser && req.body.password === findUser.password) {
            res.send({
                token: findUser._id,
                user: {
                    _id: findUser._id,
                    email: findUser.email,
                    username: toUpperFirstLetter(findUser.username),
                    photo: findUser.photo,
                    phone: findUser.phone,
                    admin: findUser.admin,
                    age: findUser.age,
                    likes: findUser.likes,
                    rated: findUser.rated,
                    shippingAddress: findUser.shippingAddress,
                },
                message: 'Ok',
            });
        } else {
            res.send({
                token: '',
                message: 'Incorrect name or password',
            });
        }
    } catch (err) {
        console.log(err);
    }
});

router.use('/registration', async (req, res) => {
    try {
        const isExist = await User.findOne({ email: req.body.email });

        if (isExist && (isExist.email === req.body.email)) {
            return res.send({ duplicate: 'The email address already exists' });
        } if (!isExist) {
            const newUser = new Registration({ ...req.body });
            const insertUser = await newUser.save();

            return res.send({
                token: insertUser._id,
                user: {
                    _id: insertUser._id,
                    email: insertUser.email,
                    phone: insertUser.phone,
                    username: toUpperFirstLetter(insertUser.username),
                    age: insertUser.age,
                },
                message: 'ok',
            });
        }
        return;
    } catch (err) {
        console.log(err);
        return res.send(err.message);
    }
});

module.exports = router;
