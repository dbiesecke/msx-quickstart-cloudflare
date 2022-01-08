const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: path.join(__dirname, 'index.js'),
  target: 'webworker',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'worker.js',
  },
  resolve: {
    extensions: [
      '.ts',
      '.js',
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
