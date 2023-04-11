const express = require("express");
const slowDown = require("express-slow-down");
const pool = require("./db");
const handleCommandLine = require("./commandHandler").handleCommandLine;
const activateLicense = require("./licenseManager").activateLicense;
const licenseManager = require("./licenseManager");
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

const activateLicenseAPI = async (req, res) => {
  const license = req.params.license;
  const result = await activateLicense(license);
  res.status(result.status).send(result.message);
};

// New endpoint for checking server connection
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get("/api/licenses", async (req, res) => {
  const licenses = await licenseManager.getAllLicenses();
  res.status(200).send(licenses);
});

app.post("/api/activate/:license", activateLicenseAPI);

app.listen(port, () => {
  console.log("Licensing Server listening at http://localhost:" + port);
});

pool
  .getConnection()
  .then(() => {
    console.log("Connected to MariaDB database.");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1);
  });

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

handleCommandLine("");
