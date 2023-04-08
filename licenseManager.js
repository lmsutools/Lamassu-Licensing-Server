const uuidv4 = require("uuid").v4,
  pool = require("./db");
async function generateLicense(e, n) {
  try {
    var t, r, a, o, s = await pool.getConnection(),
      [i] = await s.query("SELECT * FROM products WHERE name = ?", [e]);
    i ? (t = uuidv4(), r = i.id, a = new Date, (o = new Date(a)).setDate(a.getDate() + n), await s.query("INSERT INTO licenses (license_key, product_id, state, expiration_date) VALUES (?, ?, ?, ?)", [t, r, "inactive", o]), console.log(`License generated for product "${e}" with key ${t} and expiration date ` + o.toISOString()), s.release()) : console.error("Product not found: " + e)
  } catch (e) {
    console.error("Error generating license:", e)
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
async function activateLicense(e) {
  try {
    var n = await pool.getConnection(),
      [t] = await n.query("SELECT * FROM licenses WHERE license_key = ?", [e]);
    if (t) return "active" === t.state ? {
      status: 200,
      message: `License ${e} is already active.`
    } : new Date(t.expiration_date) < new Date ? {
      status: 400,
      message: `License ${e} has already expired.`
    } : (await n.query("UPDATE licenses SET state = ? WHERE license_key = ?", ["active", e]), n.release(), {
      status: 200,
      message: `License ${e} activated for product ${t.product_id}.`
    });
    throw new Error(`License ${e} not found.`)
  } catch (e) {
    return console.error("Error activating license:", e), {
      status: 400,
      message: "Error activating license."
    }
  }
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
module.exports = {
  generateLicense: generateLicense,
  getLicense: getLicense,
  renovateLicense: renovateLicense,
  changeLicenseState: changeLicenseState,
  activateLicense: activateLicense,
  getAllLicenses: getAllLicenses,
  showLicenses: showLicenses
};