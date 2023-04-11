require('dotenv').config();

<<<<<<< HEAD
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 20,
  connectionTimeout: 10000
}).on('error', err => {
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Error: Access denied. Please check your admin_license_serve user and password.');
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    console.error('Error: Connection refused or host not found. Please check your database host and ensure the database server is running.');
  } else {
    console.error('Error connecting to the pool:', err);
  }
});

module.exports = pool;
=======
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
>>>>>>> 090a1e895a04e832b60734606deee3ec80715175
