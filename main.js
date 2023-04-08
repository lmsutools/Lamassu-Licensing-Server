const express = require("express"),
  pool = require("./db"),
  handleCommandLine = require("./commandHandler")["handleCommandLine"],
  activateLicense = require("./licenseManager")["activateLicense"],
  licenseManager = require("./licenseManager"),
  app = express(),
  port = 3001,
  dbConfig = pool.config,
  activateLicenseAPI = async (e, n) => {
    e = e.params.license, e = await activateLicense(e);
    n.status(e.status).send(e.message)
  };
app.get("/api/licenses", async (e, n) => {
  try {
    var s = await licenseManager.getAllLicenses();
    n.status(200).send(s)
  } catch (e) {
    n.status(500).send("Error retrieving all licenses.")
  }
}), app.post("/api/activate/:license", activateLicenseAPI), app.listen(port, () => {
  console.log("Licensing Server listening at http://localhost:" + port)
}), pool.getConnection().then(() => {
  console.log("Connected to MariaDB database.")
}).catch(e => {
  console.error("Error connecting to database:", e), process.exit(1)
}), process.on("unhandledRejection", e => {
  console.error("Unhandled rejection:", e), process.exit(1)
}), process.on("uncaughtException", e => {
  console.error("Uncaught exception:", e), process.exit(1)
}), process.on("SIGINT", () => {
  console.log("Exiting Licensing Server."), process.exit(0)
}), handleCommandLine("");