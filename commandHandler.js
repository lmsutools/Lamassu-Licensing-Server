const productManager = require("./productManager");
const licenseManager = require("./licenseManager");

function handleCommandLine(c) {
  c.question("Enter command: ", (e) => {
    const o = e.split(" ");
    const n = o[1];
    const a = productManager.getProduct(n);
    let s;
    if (o[0] === 'renovateLicense' || o[0] === 'changeLicenseState' || o[0] === 'licenseDetails') {
      const licenseKey = o[1];
      for (const productName in productManager.products) {
        const product = productManager.products[productName];
        if (product.licenses[licenseKey]) {
          s = product.licenses[licenseKey];
          break;
        }
      }
    }

    switch (o[0]) {
      case "createProduct":
        if (o.length !== 2) {
          console.log("Usage: createProduct <productName>");
        } else {
          productManager.createProduct(n);
        }
        break;
      case "generateLicense":
        if (o.length !== 4 || o[3] !== "days") {
          console.log("Usage: generateLicense <productName> <days> days");
        } else {
          a
            ? licenseManager.generateLicense(a, o[2])
            : console.log("Product not found.");
        }
        break;
      case "showProducts":
        if (o.length !== 1) {
          console.log("Usage: showProducts");
        } else {
          productManager.showProducts();
        }
        break;
      case "show":
        if (o.length !== 2) {
          console.log("Usage: show <productName>");
        } else {
          a ? console.log(a) : console.log("Product not found.");
        }
        break;
      case "renovateLicense":
        if (o.length !== 3) {
          console.log("Usage: renovateLicense <licenseKey> <days>");
        } else {
          s
            ? licenseManager.renovateLicense(s, o[2])
            : console.log("License not found.");
        }
        break;
      case "changeLicenseState":
        if (o.length !== 3) {
          console.log("Usage: changeLicenseState <licenseKey> <newState>");
        } else {
          s
            ? licenseManager.changeLicenseState(s, o[2])
            : console.log("License not found.");
        }
        break;
      case "licenseDetails":
        if (o.length !== 2) {
          console.log("Usage: licenseDetails <licenseKey>");
        } else {
          s
            ? licenseManager.licenseDetails(s)
            : console.log("License not found.");
        }
        break;
      case "help":
        handleHelp();
        break;
      case "exit":
        c.close();
        process.exit(0);
        break;
      default:
        console.log(
          'Invalid command. Type "help" for a list of available commands.'
        );
    }
    handleCommandLine(c);
  });
}

function handleHelp() {
  console.log("Available commands:");
  console.log(" createProduct <productName>");
  console.log(" generateLicense <productName> <days> days");
  console.log(" showProducts");
  console.log(" show <productName>");
  console.log(" renovateLicense <licenseKey> <days>");
  console.log(" changeLicenseState <licenseKey> <newState>");
  console.log(" licenseDetails <licenseKey>");
  console.log(" help");
  console.log(" exit");
}

module.exports = { handleCommandLine: handleCommandLine };
