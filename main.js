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

function handleCommandLine() {
  rl.question("Enter command: ", (command) => {
    const args = command.split(" ");
    switch (args[0]) {
      case "createProduct":
        if (args.length !== 2) {
          console.log("Usage: createProduct <productName>");
        } else {
          productManager.createProduct(args[1]);
        }
        break;
      case "generateLicense":
        if (args.length !== 4 || args[3] !== "days") {
          console.log("Usage: generateLicense <productName> <days> days");
        } else {
          commandHandler.generateLicense(args[1], args[2]);
        }
        break;
      case "showProducts":
        if (args.length !== 1) {
          console.log("Usage: showProducts");
        } else {
          productManager.showProducts();
        }
        break;
      case "help":
        handleHelp();
        break;
      case "exit":
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid command. Type "help" for a list of available commands.');
    }
    handleCommandLine();
  });
}

function handleHelp() {
  console.log("Available commands:");
  console.log("  createProduct <productName>");
  console.log("  generateLicense <productName> <days> days");
  console.log("  showProducts");
  console.log("  exit");
}

handleCommandLine();
