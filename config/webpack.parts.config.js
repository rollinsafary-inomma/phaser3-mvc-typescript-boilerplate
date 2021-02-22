const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const package = require('../package.json');

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.cleanup = (paths, verbose = false) => ({
  plugins: [
    new CleanWebpackPlugin(paths, { root: process.cwd(), verbose: verbose }),
  ],
});

exports.loadJs = ({ options }) => ({
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: ['/node_modules/', '/lib/'],
        use: [
          {
            loader: 'ts-loader',
            options: options,
          },
        ],
      },

      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
    ],
  },
});

exports.sourceMaps = method => ({
  devtool: method,
});

exports.envVar = mode => ({
  plugins: [
    new webpack.DefinePlugin({
      mode: JSON.stringify(mode),
      name: JSON.stringify(package.name),
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
});

exports.injectVersion = version => ({
  plugins: [
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(version),
    }),
  ],
});
