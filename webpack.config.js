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

// Keep runtime dependencies external so the published package doesn't bundle
// (and double-ship) them. Consumers resolve these from their own node_modules.
const externals = {
  astring: "astring",
  cherow: "cherow",
  "fast-deep-equal": "fast-deep-equal",
};

// output to both ./dist and ./docs/js
module.exports = [
  // npm package build: dependencies stay external.
  { ...config, externals },
  // docs/js browser build: bundle everything so it runs standalone.
  {
    ...config,
    output: { ...output, path: path.resolve(__dirname, "docs", "js") },
  },
];
