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
  plugins: [new HTMLWebpackPlugin({
    template: "./src/index.html"
  })]
}

var GeoLocoMapRequestConfig = webpackMerge(baseConfig, {
  entry: ["./src/Request.ts"],
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
    libraryExport: 'GeoLocoMapRequest',
    library:  'GeoLocoMapRequest',
  }
})
var GeoLocoMapConfig = webpackMerge(baseConfig, {
  entry: ["./src/GeoLoco.ts"],
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
    libraryExport: 'GeoLocoMap',
    library:  'GeoLocoMap',
    }
  })


module.exports = [GeoLocoMapRequestConfig,GeoLocoMapConfig];
