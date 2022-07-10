const mongoose = require('mongoose');

const url = 'mongodb+srv://YevhenFarbitnyi:SneJe19941996@testcluster.rbjaq.mongodb.net/Test';

const main = async () => {
  await mongoose.connect(url);
};

module.exports = { main };
