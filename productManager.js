"use strict";
const licenseManager = require("./licenseManager");
const products = new Map;

function createProduct(c) {
  products.set(c, []);
  console.log("Product created: " + c);
}

function showProducts() {
  console.log("Product | Number of Active Licenses | Number of Inactive Licenses");
  products.forEach((c, t) => {
    let e = 0, o = 0;
    c.forEach(c => {
      c = licenseManager.getLicense(c);
      "Active" === c.status && e++;
      "Inactive" === c.status && o++;
    });
    console.log("Product created: " + t);
  });
}

module.exports = {
  createProduct: createProduct,
  showProducts: showProducts,
  products: products,
};
