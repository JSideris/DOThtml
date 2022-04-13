const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  mode: "production",
  target: "web",
  entry: {
    main: "./src/dothtml.ts"
  },
  output: {
    filename: "dothtml.js",
    library: {
        //name: "dothtml",
        type: "commonjs2"
    },
    path: path.resolve(__dirname, "lib"),
    clean: true,
  },
  resolve: {
    extensions: [".ts"]
  },
  module:{
    rules: [{
      test: /\.ts$/,
      loader: "ts-loader"
    }]
  },
};