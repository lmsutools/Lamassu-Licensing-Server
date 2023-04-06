"use strict";

const products = require("./productManager").products;
const licenses = require("./licenseManager").licenses;
const licenseManager = require("./licenseManager");
const productManager = require("./productManager");

function generateLicense(product, days) {
  const licenseKey = licenseManager.generateLicenseKey();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(days));

  products.get(product).push(licenseKey);
  licenses.set(licenseKey, {
    key: licenseKey,
    product: product,
    status: "Inactive",
    activationTime: null,
    lastHeartbeat: null,
    expiryDate: expiryDate.toISOString(),
    machineId: null,
    timesRenovated: 0,
  });

  console.log("License created: " + licenseKey);
}

module.exports = {
  generateLicense: generateLicense,
  licenses: licenses,
};
