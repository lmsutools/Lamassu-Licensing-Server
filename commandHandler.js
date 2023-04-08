const {
    createProduct,
    showProducts
} = require("./productManager"), {
    generateLicense,
    renovateLicense,
    changeLicenseState
} = require("./licenseManager"), showLicenses = require("./licenseManager")["showLicenses"];

function handleCommandLine(e) {
    switch (e[0]) {
        case "createProduct":
            e[1] ? createProduct(e[1]) : console.log("Usage: createProduct <productName>");
            break;
        case "showProducts":
            showProducts();
            break;
        case "generateLicense":
            e[1] && e[2] ? generateLicense(e[1], parseInt(e[2])) : console.log("Usage: generateLicense <productName> <days>");
            break;
        case "renovateLicense":
            e[1] && e[2] ? renovateLicense(e[1], parseInt(e[2])) : console.log("Usage: renovateLicense <licenseKey> <days>");
            break;
        case "changeLicenseState":
            e[1] && e[2] ? changeLicenseState(e[1], e[2]) : console.log("Usage: changeLicenseState <licenseKey> <newState>");
            break;
        case "show":
            e[1] ? showLicenses(e[1]) : console.log("Usage: show <product>");
            break;
        case "help":
            handleHelp();
            break;
        default:
            console.log('Invalid command. Type "help" to view available commands and their usages.')
    }
}

function handleHelp() {
    console.log(`
Available commands:
- createProduct <productName>
- showProducts
- generateLicense <productName> <days>
- renovateLicense <licenseKey> <days>
- changeLicenseState <licenseKey> <newState>
- show <product>
- help
- exit
`)
}
module.exports = {
    handleCommandLine: handleCommandLine
};