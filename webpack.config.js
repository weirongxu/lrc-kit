var webpack = require('webpack')

module.exports = {
  context: __dirname + '/src',
  entry: './lrc-kit',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    }],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'lrc-kit.js',
    library: 'LrcKit',
  },
}
