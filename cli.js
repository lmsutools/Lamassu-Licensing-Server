if (require.main === module) {
    console.error("cli.js should not be run directly. Run main.js instead.");
    process.exit(1);
  }
  