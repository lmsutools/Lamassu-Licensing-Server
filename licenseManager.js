"use strict";
const crypto = require("crypto");
const licenses = new Map;

function generateLicenseKey() {
  let e;
  do {
    var s = [];
    for (let e = 0; e < 4; e++) {
      var n = crypto.randomBytes(5).toString("hex").toUpperCase().substring(0, 5);
      s.push(n);
    }
    e = s.join("-");
  } while (licenses.has(e));
  return e;
}

function getLicense(licenseKey) {
  return licenses.get(licenseKey);
}

module.exports = {
  generateLicenseKey: generateLicenseKey,
  licenses: licenses,
  getLicense: getLicense
};
