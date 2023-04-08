const uuidv4 = require("uuid").v4,
  pool = require("./db");
async function createProduct(r) {
  try {
    var o = await pool.getConnection(),
      e = uuidv4();
    await o.query("INSERT INTO products (id, name) VALUES (?, ?)", [e, r]), console.log(`Product "${r}" created with ID ${e}.`), o.release()
  } catch (o) {
    "ER_DUP_ENTRY" === o.code ? console.error(`Error creating product: Product "${r}" already exists.`) : console.error("Error creating product:", o)
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