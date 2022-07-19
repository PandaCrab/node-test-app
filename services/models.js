const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, rquired: true },
    name: { type: String, required: true }, 
    price: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    color: String,
    quantity: { type: Number, required: true },
    width: Number,
    height: Number
}, {
    collection: 'storage'
});

const Product = mongoose.model('product', productSchema);

const authSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
    age: String,
    phone: Number,
    admin: Boolean
}, { collection: 'users' });

const User = mongoose.model('auth', authSchema);

const registrationSchema = new mongoose.Schema({
    date: Date,
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    age: Number
}, { collection: 'users' });

const Registration = mongoose.model('registration', registrationSchema);

const UserSchema = mongoose.Schema({
    email: String,
    username: String,
    phone: Number,
    admin: Boolean,
    age: Number
});

const UserInfo = mongoose.model('users', UserSchema);

const OrderSchema = mongoose.Schema({
    date: Date,
    userId: { type: String, required: true, },
    orderId: { type: Number, require: true, unique: true },
    username: { type: String, required: true },
    shippingInfo: {
        phone: { type: String, rquireed: true },
        address: { 
            street: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
            zip: { type: String, required: true }
         },
        optional: String
    },
    orderInfo: {
        products: [Object]
    }
});

const Order = mongoose.model('orders', OrderSchema);

module.exports = { Product, User, Registration, UserInfo, Order };
