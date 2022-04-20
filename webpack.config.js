const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: `${__dirname}/dist`,
        filename: 'main.js'
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [new HtmlWebpackPlugin({
        title: "DOThtml"
    })],
};
