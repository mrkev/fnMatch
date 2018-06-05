const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new UglifyJSPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'fnMatch.js',
    library: 'fnMatch',
    libraryTarget: 'umd',
  },
  mode: 'production',
};