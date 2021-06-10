const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    filename: "dothtml.min.js",
    library: {
        //name: "dothtml",
        type: "commonjs2"
    },
    path: path.resolve(__dirname, "lib"),
    clean: true,
  },
};