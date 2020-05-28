const path = require("path");

const output = {
  path: path.resolve(__dirname, "dist"),
  filename: "fnMatch.js",
  library: "fnMatch",
  libraryTarget: "umd",
};

const config = {
  entry: "./src/index.js",
  optimization: {
    minimize: true,
  },
  output,
  mode: "production",
};

module.exports = [
  config,
  {
    ...config,
    output: { ...output, path: path.resolve(__dirname, "docs", "js") },
  },
];
