const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'fnMatch.js',
  library: 'fnMatch',
  libraryTarget: 'umd',
}

const config = {
  entry: './src/index.js',
  plugins: [
    new UglifyJSPlugin(),
  ],
  output,
  mode: 'production',
};

module.exports = [
  config,
  { ...config,
    output: { ...output,
      path: path.resolve(__dirname, 'docs', 'js')
    }
  }
]