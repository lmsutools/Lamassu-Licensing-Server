const readline = require("readline"),
  handleCommandLine = require("./commandHandler")["handleCommandLine"],
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
console.log('\nWelcome to the Licensing Server CLI.\nType "help" to view available commands and their usages.'), rl.on("line", e => {
  handleCommandLine(e.trim().split(" "))
}), rl.on("close", () => {
  console.log("\nExiting Licensing Server CLI."), process.exit(0)
});