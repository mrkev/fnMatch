const path = require("path");

const output = {
  path: path.resolve(__dirname, "dist"),
  filename: "fnMatch.js",
  library: "fnMatch",
  libraryTarget: "umd",
};

const tsSetup = {
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

const config = {
  entry: "./src/index.ts",
  optimization: {
    minimize: true,
  },
  output,
  mode: "production",
  ...tsSetup,
};

// output to both ./dist and ./docs/js
module.exports = [
  config,
  {
    ...config,
    output: { ...output, path: path.resolve(__dirname, "docs", "js") },
  },
];
