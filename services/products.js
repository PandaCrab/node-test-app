const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const getMultiple = async (page = 1) => {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * FROM products.store LIMIT ${offset}, ${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return { data, meta };
};

const create = async (product) => {
    const result = await db.query(
        `INSERT INTO products.store (name, price, imgUrl, color, quantity)
        VALUES ('${product.name}', '${product.price}', '${product.imgUrl}', '${product.color}', '${product.quantity}')`
    );

    let message = 'Error when try add product';

    if (result.affectedRows) {
        message = 'Product successfuly added'
    }

    return message;
};

module.exports = { getMultiple, create };
