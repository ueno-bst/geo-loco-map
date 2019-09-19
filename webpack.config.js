const webpack = require('webpack');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require('webpack-merge');

const packageJson = require("./package");
const version = packageJson.version;

var baseConfig = {
	resolve: {
		extensions: ['.js', '.ts'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader"
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
				}
			}
		]
	},
	mode: process.env.NODE_ENV || "development",
	devServer: {
		contentBase: __dirname + '/public',
		publicPath: '/',
		noInfo: true,
		historyApiFallback: true

	},
	plugins: [
		new webpack.BannerPlugin({
			banner: `${packageJson.name} v${packageJson.version} | ${packageJson.author} | ${packageJson.license} license`
		}),
		new HTMLWebpackPlugin({
			template: "./src/index.html"
		})
	]
};

var GeoLocoMapConfig = webpackMerge(baseConfig, {
	output: {
		filename: `geo-loco-map.js`,
		path: __dirname + "/dist/" + version,
		libraryExport: 'GeoLocoMap',
		library: 'GeoLocoMap',
		libraryTarget: 'umd2'
	},
	entry: './src/GeoLocoMap.ts',
	name: 'umd',
	mode: 'production',
});


module.exports = GeoLocoMapConfig;
