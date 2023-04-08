const pool = require("./db");
pool.getConnection().then(e => {
    e.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    )
  `).then(e => {
        console.log("products table created")
    }).catch(e => {
        console.error("Error creating products table:", e)
    }), e.query(`
    CREATE TABLE IF NOT EXISTS licenses (
      id INT PRIMARY KEY AUTO_INCREMENT,
      license_key VARCHAR(36) NOT NULL UNIQUE,
      product_id VARCHAR(36) NOT NULL,
      state ENUM("inactive", "active", "expired") NOT NULL,
      expiration_date DATETIME NOT NULL,
      machine_id VARCHAR(50),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `).then(e => {
        console.log("licenses table created")
    }).catch(e => {
        console.error("Error creating licenses table:", e)
    }), e.release()
}).catch(e => {
    console.error("Error creating tables:", e)
});
