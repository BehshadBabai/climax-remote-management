const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devServer = require('./devServer');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer,
  optimization: {
    //for hot module replacement
    runtimeChunk: 'single'
  },
  performance: {
    maxEntrypointSize: 10000000,
    maxAssetSize: 250000,
    hints: false
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_ENV: JSON.stringify('development')
    })
  ]
});
