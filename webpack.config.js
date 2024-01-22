const path = require('path');

module.exports = {
	entry: './src/index.ts', // your main TypeScript file
	output: {
		path: path.resolve(__dirname, "build_umd"),
		filename: 'dothtml.js',
		// library: 'dot',
		// libraryTarget: 'umd',
		// globalObject: 'this',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};
