const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const buildPaths = require('./buildPaths');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  serve: {
    content: buildPaths.build.web,
    dev: {
      stats: false
    },
    hot: true,
    open: true,
    host: process.env.HOST,
    port: process.env.PORT
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.HOST': JSON.stringify(process.env.HOST || 'localhost'),
      'process.env.PORT': JSON.stringify(process.env.PORT || 80)
    }),
    new FriendlyErrorsPlugin({
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: 'Webpack error',
          subtitle: error.file || '',
          message: `${severity}: ${error.name}`,
          sound: true
        });
      }
    })
  ]
});
