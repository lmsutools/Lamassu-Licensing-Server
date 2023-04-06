const express = require("express");
const readline = require("readline");
const app = express();
const port = 3129;
const productManager = require("./productManager");
const commandHandler = require("./commandHandler");
const licenseManager = require("./licenseManager");

app.use(express.json());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

commandHandler.handleCommandLine(rl);