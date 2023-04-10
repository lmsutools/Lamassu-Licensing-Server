require('dotenv').config();

const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 20,
    connectionTimeout: 1e4
});

module.exports = {
    getConnection: () => pool.getConnection()
};