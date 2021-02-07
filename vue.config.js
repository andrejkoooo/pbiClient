const path = require("path");

module.exports = {
  // ...other vue-cli plugin options...
  css: { extract: false },
  outputDir: path.resolve(
    __dirname,
    "../WebApplication1/WebApplication1/Scripts/vue"
  )
};