// Import required modules
const express = require("express");
const slowDown = require("express-slow-down");
const pool = require("./db");
const handleCommandLine = require("./commandHandler").handleCommandLine;
const activateLicense = require("./licenseManager").activateLicense;
const getLicense = require("./licenseManager").getLicense;
const licenseManager = require("./licenseManager");

// Configure the app and port
const app = express();
const port = 6000;

// Configure the slow down middleware
const speedLimiter = slowDown({
  windowMs: 20 * 1000, // 20 seconds
  delayAfter: 5, // Allow 5 requests without delaying
  delayMs: 5000, // Add 1000ms delay per request above delayAfter
});

// Apply the slow down middleware to all routes
app.use(speedLimiter);

// Enable JSON parsing for the request body
app.use(express.json());

// API endpoint to activate a license
const activateLicenseAPI = async (req, res) => {
  const licenseKey = req.params.license;
  const machineId = req.params.machine_id;
  const result = await activateLicense(licenseKey, machineId);
  res.status(result.status).send(result.message);
};

// API endpoint to deactivate a license
const deactivateLicenseAPI = async (req, res) => {
  const licenseKey = req.params.license;
  const machineId = req.body.machineId;
  const result = await licenseManager.deactivateLicense(licenseKey, machineId);
  res.status(result.status).send(result.message);
};

// API endpoint to get all licenses
app.get("/api/licenses", async (req, res) => {
  const licenses = await licenseManager.getAllLicenses();
  res.status(200).send(licenses);
});

// API endpoint to get the license status
async function getLicenseStatusAPI(req, res) {
  const licenseKey = req.params.license;
  const machineId = req.params.machine_id;

  if (!await licenseManager.validateMachineId(machineId)) {
    res.status(400).send({ status:400, message: `Invalid machine_id format: ${machineId}` });
    return;
  }

  const license = await getLicense(licenseKey);

  if (license) {
    if (license.machine_id !== machineId) {
      res.status(400).send({ status: 400, message: `License ${licenseKey} is not activated on the given machine.` });
    } else {
      res.status(200).send({ status: 200, state: license.state, expiration_date: license.expiration_date });
    }
  } else {
    res.status(404).send({ status: 404, message: "License not found." });
  }
}

// Register API routes
app.post("/api/deactivate/:license", deactivateLicenseAPI);
app.post("/api/activate/:license", activateLicenseAPI);
app.get("/api/licenses/:license", getLicenseStatusAPI);

// Endpoint for checking server connection
app.get("/ping", (req, res) => {
  res.send("pong");
});

//Deactivate ENDPOINT
app.post("/api/activate/:license/:machine_id", activateLicenseAPI);

// Start the server
app.listen(port, () => {
  console.log("Licensing Server listening at http://localhost:" + port);
});

// Connect to the database
pool
  .getConnection()
  .then(() => {
    console.log("Connected to MariaDB database.");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1);
  });

// Handle process events
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("Exiting Licensing Server.");
  process.exit(0);
});

// Handle command line input
handleCommandLine("");
