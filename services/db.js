const mongoose = require('mongoose');
const { db_access } = require('../config');

const url = `mongodb+srv://${db_access}@testcluster.rbjaq.mongodb.net/Test`;

const main = async () => {
	await mongoose.connect(url);
};

module.exports = { main };
