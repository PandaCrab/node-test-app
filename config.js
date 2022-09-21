const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    db_access: process.env.DB_ACCESS,
    port: process.env.PORT,
};
