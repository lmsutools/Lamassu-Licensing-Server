const products = {};

function createProduct(productName) {
  if (products[productName]) {
    console.log(`Product ${productName} already exists.`);
  } else {
    products[productName] = {
      name: productName,
      licenses: {},
    };
    console.log(`Product ${productName} created.`);
  }
}

function showProducts() {
  console.log("Products:");
  for (const productName in products) {
    console.log(`- ${productName}`);
  }
}

function getProduct(productName) {
  return products[productName];
}

module.exports = {
  createProduct,
  showProducts,
  getProduct,
};
