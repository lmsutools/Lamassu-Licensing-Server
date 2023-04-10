require('dotenv').config();
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