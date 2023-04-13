const uuidv4 = require("uuid").v4,
  pool = require("./db");


  async function checkLicenseState(licenseKey) {
    const connection = await pool.getConnection();
    const [license] = await connection.query("SELECT * FROM licenses WHERE license_key = ?", [licenseKey]);
    connection.release();
  
    if (license) {
      return { status: 200, message: license.state };
    } else {
      return { status: 404, message: "License not found." };
    }
  }
  

  

  async function generateLicense(productName, days) {
    try {
      const connection = await pool.getConnection();
      const [product] = await connection.query("SELECT * FROM products WHERE name = ?", [productName]);
  
      if (product) {
        const licenseKey = uuidv4();
        const productId = product.id;
        const creationDate = new Date();
        let expirationDate = new Date(creationDate);
        expirationDate.setDate(creationDate.getDate() + days);
  
        await connection.query(
          "INSERT INTO licenses (license_key, product_id, state, expiration_date, creation_date) VALUES (?, ?, ?, ?, ?)",
          [licenseKey, productId, "inactive", expirationDate, creationDate]
        );
  
        console.log(`License generated for product "${productName}" with key ${licenseKey} and expiration date ` + expirationDate.toISOString());
        connection.release();
      } else {
        console.error("Product not found: " + productName);
      }
    } catch (err) {
      console.error("Error generating license:", err);
    }
  }


async function getLicense(e) {
  try {
    var n = await pool.getConnection(),
      [t] = await n.query("SELECT * FROM licenses WHERE license_key = ?", [e]);
    return t ? (n.release(), t) : (console.error("License not found: " + e), null)
  } catch (e) {
    return console.error("Error retrieving license:", e), null
  }
}
async function renovateLicense(e, n) {
  try {
    var t, r = await pool.getConnection(),
      [a] = await r.query("SELECT * FROM licenses WHERE license_key = ?", [e]);
    a ? (new Date, (t = new Date(a.expiration_date)).setDate(t.getDate() + n), await r.query("UPDATE licenses SET expiration_date = ? WHERE license_key = ?", [t, e]), console.log(`License ${e} updated. New expiration date: ` + t.toISOString()), r.release()) : console.error("License not found: " + e)
  } catch (e) {
    console.error("Error renovating license:", e)
  }
}
async function changeLicenseState(e, n) {
  try {
    var t = await pool.getConnection(),
      [r] = await t.query("SELECT * FROM licenses WHERE license_key = ?", [e]);
    r ? (await t.query("UPDATE licenses SET state = ? WHERE license_key = ?", [n, e]), console.log(`License ${e} state updated. New state: ` + n), t.release()) : console.error("License not found: " + e)
  } catch (e) {
    console.error("Error changing license state:", e)
  }
}


async function activateLicense(licenseKey, machineId) {
  const connection = await pool.getConnection();
  const [license] = await connection.query("SELECT * FROM licenses WHERE license_key = ?", [licenseKey]);

  if (license) {
    if (license.state !== "inactive") {
      connection.release();
      return { status: 400, message: `License ${licenseKey} is not inactive.` };
    } else if (new Date(license.expiration_date) < new Date()) {
      connection.release();
      return { status: 400, message: `License ${licenseKey} has already expired.` };
    } else {
      const activationDate = new Date();
      await connection.query("UPDATE licenses SET state = 'active', machine_id = ?, activation_date = ? WHERE license_key = ?", [machineId, activationDate, licenseKey]);
      connection.release();
      return { status: 200, message: `License ${licenseKey} activated for product ${license.product_id}.` };
    }
  } else {
    connection.release();
    return { status: 404, message: `License ${licenseKey} not found.` };
  }
}

async function deactivateLicense(licenseKey) {
  const connection = await pool.getConnection();
  const [license] = await connection.query("SELECT * FROM licenses WHERE license_key = ?", [licenseKey]);

  if (!license) {
    connection.release();
    return { status: 404, message: `License ${licenseKey} not found.` };
  }

  if (license.state !== 'active') {
    connection.release();
    return { status: 400, message: `License ${licenseKey} is not active.` };
  }

  await connection.query("UPDATE licenses SET state = 'inactive', machine_id = NULL WHERE license_key = ?", [licenseKey]);
  connection.release();

  return { status: 200, message: `License ${licenseKey} deactivated.` };
}


async function getAllLicenses() {
  try {
    var e = await pool.getConnection(),
      [n] = await e.query("SELECT * FROM licenses");
    return e.release(), n
  } catch (e) {
    return console.error("Error retrieving all licenses:", e), []
  }
}
async function showLicenses(e) {
  try {
    var n, t = await pool.getConnection(),
      [r] = await t.query("SELECT * FROM products WHERE name = ?", [e]);
    r ? (n = await t.query("SELECT * FROM licenses WHERE product_id = ?", [r.id]), console.log(`Licenses for product "${e}":`), console.table(n)) : console.error("Product not found: " + e), t.release()
  } catch (e) {
    console.error("Error getting licenses for product:", e)
  }
}

const machineIdRegex = /^[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}$/;
async function validateMachineId(machineId) {
  return machineIdRegex.test(machineId);
}


module.exports = {
  generateLicense: generateLicense,
  getLicense: getLicense,
  renovateLicense: renovateLicense,
  changeLicenseState: changeLicenseState,
  activateLicense: activateLicense,
  deactivateLicense : deactivateLicense,
  getAllLicenses: getAllLicenses,
  showLicenses: showLicenses
};