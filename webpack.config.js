const path = require('path')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: "development",
  entry: {
    game: './client/js/index.js',
    login: './client/js/login.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'clientscripts')
  }
}