const webpack = require('webpack');
const version = "1.8.7-alpha-2";
module.exports = {
  output: {
    filename: `[name].${version}.min.js`
  },
  plugins: [
    new webpack.DefinePlugin({
      "VERSION": JSON.stringify(version)
    })
  ]
}