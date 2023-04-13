const mariadb = require('mariadb');

// Replace the values with your own credentials
const DB_HOST = 'localhost';
const DB_USER = 'admin_license_server';
const DB_PASSWORD = 'K&vKEi87a2g';
const DB_NAME = 'licenses_db';

const pool = mariadb.createPool({
  host: DB_HOST,
  user: DB_USER,
  port: 3080,
  password: DB_PASSWORD,
  database: DB_NAME
});

async function createTableAndInsertData() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Create the `users` table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        age INT
      )
    `);
    console.log('Table created.');

    // Insert some dummy data
    await conn.query(`
      INSERT INTO users (name, email, age)
      VALUES
        ('John', 'john@example.com', 30),
        ('Jane', 'jane@example.com', 25),
        ('Bob', 'bob@example.com', 40)
    `);
    console.log('Data inserted.');
    
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) return conn.end();
  }
}

createTableAndInsertData();
