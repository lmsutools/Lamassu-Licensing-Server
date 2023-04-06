const { v4: uuidv4 } = require("uuid");

function generateLicense(product, days) {
  const licenseKey = uuidv4();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + parseInt(days));

  product.licenses[licenseKey] = {
    key: licenseKey,
    expirationDate,
    state: "active",
  };

  console.log(`Generated license key for ${product.name}: ${licenseKey}`);
}

function renovateLicense(license, days) {
  const expirationDate = new Date(license.expirationDate);
  expirationDate.setDate(expirationDate.getDate() + parseInt(days));
  license.expirationDate = expirationDate;

  console.log(`Renovated license ${license.key}. New expiration date: ${expirationDate.toISOString()}`);
}

function changeLicenseState(license, newState) {
  license.state = newState;
  console.log(`Changed license ${license.key} state to ${newState}`);
}

function licenseDetails(license) {
  console.log(`License details for ${license.key}:`);
  console.log(`- Expiration date: ${license.expirationDate.toISOString()}`);
  console.log(`- State: ${license.state}`);
}

function getLicense(product, licenseKey) {
  return product.licenses[licenseKey];
}

module.exports = {
  generateLicense,
  renovateLicense,
  changeLicenseState,
  licenseDetails,
  getLicense,
};
