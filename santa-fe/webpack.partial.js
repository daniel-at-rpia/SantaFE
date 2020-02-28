const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "VERSION": JSON.stringify("1.1.6")
    })
  ]
}