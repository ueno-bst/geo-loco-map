const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require('webpack-merge');

var baseConfig = {
	resolve: {
		extensions: ['.js', '.ts'],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			use: "ts-loader"
		}]
	},
	mode: process.env.NODE_ENV || "development",
	devServer: {
		contentBase: __dirname + '/public',
		publicPath: '/',
		noInfo: true,
		historyApiFallback: true

	},
	plugins: [
		new HTMLWebpackPlugin({
			template: "./src/index.html"
		})
	]
}

var GeoLocoMapConfig = webpackMerge(baseConfig, {
	output: {
		filename: 'bundle.js',
		path: __dirname + "/dist",
		libraryExport: 'GeoLocoMap',
		library: 'GeoLocoMap',
		libraryTarget: 'umd'
	},
	entry: './src/GeoLoco.ts',
	name: 'umd',
	mode: 'production',
})


module.exports = GeoLocoMapConfig;
