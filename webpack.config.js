const webpack = require('webpack');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require('webpack-merge');
const DtsBundlePlugin = require('dts-bundle-webpack');

const packageJson = require("./package");
const version = packageJson.version;

module.exports = env => {
	return {
		entry: './src/GeoLocoMap.ts',
		name: 'umd',
		resolve: {
			extensions: ['.ts'],
		},
		output: {
			filename: `geo-loco-map.js`,
			path: __dirname + "/dist/" + version,
			libraryExport: 'GeoLocoMap',
			library: 'GeoLocoMap',
			libraryTarget: 'umd2'
		},
		module: {
			rules: [
				{
					test: /\.ts(x?)$/,
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
		mode: (env && env.production) ? "production" : "development",
		devServer: {
			contentBase: __dirname + '/src',
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
			}),
			new HTMLWebpackPlugin({
				template: "./src/style.css"
			}),
			new DtsBundlePlugin({
				name: 'GeoLocoMap',
				main: 'src/GeoLocoMap.d.ts',
				baseDir: 'src',
				out: `${__dirname}/dist/${packageJson.version}/@types/geo-loco-map.d.ts`
			})
		]
	}
};
