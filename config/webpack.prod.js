const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CustomFunctionsMetadataPlugin = require('custom-functions-metadata-plugin');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      BUILD_ENV: JSON.stringify('production')
    }),
  ],
  performance: {
    maxEntrypointSize: 5000000,
    maxAssetSize: 250000,
    hints: 'warning'
  },
  optimization: {
    minimize: true
  }
});
