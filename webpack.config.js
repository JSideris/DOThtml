const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  mode: "production",
  target: "web",
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