const webpack = require('webpack');
const version = "2.3.27";
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