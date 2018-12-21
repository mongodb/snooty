const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: __dirname + '/src/templates/guide.js',
  output: {
    path: __dirname + '/dist',
    filename: './static/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: __dirname + '/src/incremental/index.html'
    })
  ]
};