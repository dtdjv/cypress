const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    "chromeWebSecurity": false,
    "experimentalSessionAndOrigin": true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
    },
  },
});
