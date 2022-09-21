const mongoose = require('mongoose');
// eslint-disable-next-line camelcase
const { db_access } = require('../config');

// eslint-disable-next-line camelcase
const url = `mongodb+srv://${db_access}@testcluster.rbjaq.mongodb.net/Test`;

const main = async () => {
    await mongoose.connect(url);
};

module.exports = { main };
