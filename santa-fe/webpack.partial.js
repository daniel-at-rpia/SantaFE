const webpack = require('webpack');
const version = "2.3.19-searchEngine-alpha-3";
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