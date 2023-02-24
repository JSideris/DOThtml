const path = require("path");

module.exports = {
  mode: "production",
  // ???
  entry: path.resolve(__dirname, "./src/dothtml.ts"),
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "dothtml.js",
    libraryTarget: "umd",
    // I don't really think this is necessary. It's already specified in the package.json.
    // library: {
    //     //name: "dothtml",
    //     type: "commonjs2"
    // },
    // library: "dothtml",
    clean: true,
  },
  devtool: 'source-map',
  target: "web",
  entry: {
    main: "./src/dothtml.ts"
  },
  resolve: {
    extensions: [".ts"]
  },
  module:{
    rules: [{
      test: /\.ts$/,
      // According to ChatGPT, this improves performance.
      exclude: /node_modules/,
      loader: "ts-loader"
    }]
  },
};