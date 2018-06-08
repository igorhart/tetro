require('dotenv').config(); // loads variables from .env to process.env
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlTemplate = require('html-webpack-template');
const buildPaths = require('./buildPaths');

module.exports = {
  resolve: {
    modules: [buildPaths.src, 'node_modules'],
    extensions: ['.js']
  },
  entry: {
    app: [buildPaths.client]
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanPlugin([buildPaths.build.web]),
    new CopyPlugin([
      {
        context: buildPaths.client,
        from: 'assets',
        to: 'assets'
      }
    ]),
    new HtmlPlugin({
      template: HtmlTemplate,
      title: 'Pixiplate',
      inject: false,
      mobile: true
    })
  ],
  output: {
    filename: '[name].js',
    path: buildPaths.build.web
  }
};
