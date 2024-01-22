const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
	entry: './src/index.ts',
	mode: 'development',
	devtool: 'inline-source-map',
	output: {
		path: `${__dirname}/dist`,
		filename: '[name].[contenthash].js',
  		chunkFilename: '[id].[chunkhash].js'
	},
	module: {
		rules: [
			{ 
				test: /\.ts$/, 
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					  },
				]
			},
			{
				test: /\.css$/,
				// include: path.resolve(__dirname, 'src/assets/styles'),
				exclude: /node_modules/,
				use: ['raw-loader'],
			},
			{
                test: /\.s[ac]ss$/i,
                use: [
                    'raw-loader',
                    'sass-loader',
                ],
            },
			{
				test: /\.(frag|vert|comp)$/,
				use: 'raw-loader',
			},
			{
				test: /\.(woff|woff2|ttf|eot|otf)$/,
				include: path.resolve(__dirname, 'src/assets/fonts'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
						}
					}
				]
			},
			{
				test: /\.(svg|avif|png|jpg)$/,
				include: path.resolve(__dirname, 'src/assets'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [".js", ".ts"],
		symlinks: false,
		// Webpack dev server throws errors if this line is removed.
		// alias: {dothtml: path.resolve("./node_modules/dothtml")},
		fallback: {
			http: false
		}
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({}),
		new HtmlWebpackPlugin({
			title: "DOThtml",
			template: "./src/index.html",
			meta: [ 
				// TODO: update image previews.
				{'viewport': 'width=device-width, initial-scale=1, user-scalable=no'},
				{ "name": "description", "content": "DOThtml is a powerful but light-weight framework for building modern web applications in TypeScript." },
				{ "property": "og:title", "content": "DOThtml" },
				{ "property": "og:description", "content": "DOThtml is a powerful but light-weight framework for building modern web applications in TypeScript." },
				{ "property": "og:image", "content": "https://dothtml.org/images/preview.jpg"},
				{ "property": "og:url", "content": "https://dothtml.org" },
				{ "property": "og:type", "content": "website" },
				{ "name": "twitter:card", "content": "summary_large_image" },
				{ "name": "twitter:title", "content": "DOThtml" },
				{ "name": "twitter:description", "content": "DOThtml is a powerful but light-weight framework for building modern web applications in TypeScript." },
				{ "name": "twitter:image", "content": "https://dothtml.org/images/preview.jpg"}
			],
			// favicon: "./src/assets/images/icons/favicon.png"
		}),
	],
	devServer: {
		hot: true
	},
	optimization:{
		splitChunks: {
			chunks: 'all',
			minSize: 0,
			maxSize: 20000,
			minChunks: 1,
			maxInitialRequests: Infinity,
			enforceSizeThreshold: 20000,
		},
	},
	performance: {
		hints: false,
		maxEntrypointSize: 51200000,
		maxAssetSize: 51200000
	}
};
