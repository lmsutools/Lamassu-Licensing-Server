require('dotenv').config();
<<<<<<< HEAD
const readline = require('readline');
const mariadb = require('mariadb');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const rootPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.ROOT_USER,
    password: process.env.ROOT_PASSWORD,
    connectionLimit: 20,
    connectionTimeout: 10000
  }).on('error', err => {
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Error: Access denied. Please check your root user and password.');
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    console.error('Error: Connection refused or host not found. Please check your database host and ensure the database server is running.');
  } else {
    console.error('Error connecting to the root pool:', err);
  }
});

async function main() {
    try {
      const rootConn = await rootPool.getConnection();
      
      const dbExists = await rootConn.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`);
      if (dbExists.length) {
      const deleteDb = await new Promise((resolve) => {
        rl.question("The 'licenses_db' database already exists. Do you want to delete it? (y/yes/n/no) ", (answer) => {
          resolve(answer.toLowerCase());
        });
      });

      if (deleteDb === 'y' || deleteDb === 'yes') {
        await rootConn.query('DROP DATABASE licenses_db');
        console.log("Deleted 'licenses_db' database.");
      } else {
        console.log("Aborting.");
        rootConn.release();
        rl.close();
        process.exit(0);
      }
    }

    await rootConn.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Created '${process.env.DB_NAME}' database.`);
    
    const userExists = await rootConn.query(`SELECT User FROM mysql.user WHERE User='${process.env.ADMIN_USER}'`);
    if (userExists.length) {
      const deleteUser = await new Promise((resolve) => {
        rl.question("The 'admin_license_serve' user already exists. Do you want to delete it? (y/yes/n/no) ", (answer) => {
          resolve(answer.toLowerCase());
        });
      });

      if (deleteUser === 'y' || deleteUser === 'yes') {
        await rootConn.query("DROP USER 'admin_license_serve'@'%'");
        console.log("Deleted 'admin_license_serve' user.");
      } else {
        console.log("Aborting.");
        rootConn.release();
        rl.close();
        process.exit(0);
      }
    }

    await rootConn.query(`CREATE USER ${process.env.ADMIN_USER}@'%' IDENTIFIED BY '${process.env.ADMIN_PASSWORD}'`);
    console.log(`Created '${process.env.ADMIN_USER}' user.`);
    
    await rootConn.query(`GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO ${process.env.ADMIN_USER}@'%'`);
    console.log(`Granted all privileges on '${process.env.DB_NAME}' to '${process.env.ADMIN_USER}' user.`);
    
    rootConn.release();
  } catch (error) {
    console.error("Error setting up the database and user:", error);
  } finally {
    rl.close();
  }
}

main().then(() => {
    const pool = require('./db');
  
    pool.getConnection().then(conn => {
      conn.query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          creation_date DATETIME NOT NULL
        )
      `).then(() => {
        console.log("products table created");
      }).catch(err => {
        console.error("Error creating products table:", err);
      });
  
      conn.query(`
        CREATE TABLE IF NOT EXISTS licenses (
          id INT PRIMARY KEY AUTO_INCREMENT,
          license_key VARCHAR(36) NOT NULL UNIQUE,
          product_id VARCHAR(36) NOT NULL,
          state ENUM("inactive", "active", "expired") NOT NULL,
          expiration_date DATETIME NOT NULL,
          activation_date DATETIME,
          creation_date DATETIME NOT NULL,
          license_type ENUM('trial', 'standard', 'enterprise') NOT NULL,
          user_email VARCHAR(255),
          purchase_date DATETIME,
          renewal_date DATETIME,
          max_activations INT,
          current_activations INT,
          notes TEXT,
          machine_id VARCHAR(50),
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `).then(() => {
        console.log("licenses table created");
      }).catch(err => {
        console.error("Error creating licenses table:", err);
      });
  
      conn.release();
    }).catch(err => {
      console.error("Error creating tables:", err);
    });
  });
  
=======
const pool = require("./db");
const readline = require('readline');

async function confirm(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
    });
  });
}

pool.getConnection().then(async (conn) => {
  // Database deletion and creation
  const dbExists = await conn.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'licenses_db'");
  if (dbExists.length > 0) {
    if (await confirm("Database 'licenses_db' already exists. Do you want to delete it? (yes/no): ")) {
      await conn.query("DROP DATABASE licenses_db");
      console.log("Database 'licenses_db' deleted");
    } else {
      console.log("Database 'licenses_db' already exists, skipping creation");
      return;
    }
  }

  await conn.query("CREATE DATABASE licenses_db");
  console.log("Database 'licenses_db' created");

  // User deletion and creation
  const userExists = await conn.query("SELECT COUNT(*) as count FROM mysql.user WHERE user = 'admin_license_server' AND host = 'localhost'");
  if (userExists[0].count > 0) {
    if (await confirm("User 'admin_license_server' already exists. Do you want to delete it? (yes/no): ")) {
      await conn.query("DROP USER 'admin_license_server'@'localhost'");
      console.log("User 'admin_license_server' deleted");
    } else {
      console.log("User 'admin_license_server' already exists, skipping creation");
      return;
    }
  }

  await conn.query("CREATE USER 'admin_license_server'@'localhost' IDENTIFIED BY 'c@bhme2E54$uOr1'");
  console.log("User 'admin_license_server' created");

  await conn.query("GRANT ALL PRIVILEGES ON licenses_db.* TO 'admin_license_server'@'localhost'");
  await conn.query("FLUSH PRIVILEGES");
  console.log("Privileges granted to 'admin_license_server'");

  // Table creation
  await conn.query("USE licenses_db");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE,
      creation_date DATETIME NOT NULL
    )
  `);
  console.log("products table created");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS licenses (
      id INT PRIMARY KEY AUTO_INCREMENT,
      license_key VARCHAR(36) NOT NULL UNIQUE,
      product_id VARCHAR(36) NOT NULL,
      state ENUM("inactive", "active", "expired") NOT NULL,
      expiration_date DATETIME NOT NULL,
      activation_date DATETIME,
      creation_date DATETIME NOT NULL,
      license_type ENUM('trial', 'standard', 'enterprise') NOT NULL,
      user_email VARCHAR(255),
      purchase_date DATETIME,
      renewal_date DATETIME,
      max_activations INT,
      current_activations INT,
      notes TEXT,
      machine_id VARCHAR(50),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  console.log("licenses table created");

  conn.release();
}).catch(err => {
  console.error("Error creating tables:", err);
});
>>>>>>> 090a1e895a04e832b60734606deee3ec80715175
