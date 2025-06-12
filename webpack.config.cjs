const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/popup.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: ['web', 'es2020'], // for extensions and modern JS
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // optional if you want transpiling
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
