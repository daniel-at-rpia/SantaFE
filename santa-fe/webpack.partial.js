const webpack = require('webpack');
const version = "2.1.23-beta";
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