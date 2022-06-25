const merge = require('webpack-merge')
const config = require('./webpack.config')
// console.log(merge)
module.exports = merge.merge(config, {
  mode: "development"
})