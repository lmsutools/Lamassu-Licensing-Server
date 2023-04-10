const uuidv4 = require("uuid").v4;
const pool = require("./db");

async function createProduct(productName) {
  try {
    const connection = await pool.getConnection();
    const productId = uuidv4();
    const creationDate = new Date();

    await connection.query("INSERT INTO products (id, name, creation_date) VALUES (?, ?, ?)", [productId, productName, creationDate]);
    console.log(`Product "${productName}" created with ID ${productId}.`);
    connection.release();
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.error(`Error creating product: Product "${productName}" already exists.`);
    } else {
      console.error("Error creating product:", err);
    }
  }
}

async function showProducts() {
  try {
    var o = await pool.getConnection(),
      r = await o.query("SELECT * FROM products");
    console.log("All products:"), console.table(r), o.release()
  } catch (o) {
    console.error("Error getting products:", o)
  }
}
module.exports = {
  createProduct: createProduct,
  showProducts: showProducts
};