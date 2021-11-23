const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const package = require('../package.json');
const envProduction = require('../envs/env.production');
const envDevelopment = require('../envs/env.development');
const envLocal = require('../envs/env.local');

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    host,
    port,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
});

exports.cleanup = (paths, verbose = false) => ({
  plugins: [new CleanWebpackPlugin({ verbose: verbose })],
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
        test: [/\.vert$/, /\.frag$/, /\.bin$/, /\.txt$/],
        use: 'raw-loader',
      },
    ],
  },
});

exports.sourceMaps = (method) => ({
  devtool: method,
});

const envs = {
  local: envLocal,
  development: envDevelopment,
  production: envProduction,
};

exports.envVar = (envName, modeName) => ({
  plugins: [
    new webpack.DefinePlugin({
      env: JSON.stringify(envs[envName]),
      mode: JSON.stringify(modeName),
      name: JSON.stringify(package.name),
      envName: JSON.stringify(envName),
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
});

exports.injectVersion = (version) => ({
  plugins: [
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(version),
    }),
  ],
});
