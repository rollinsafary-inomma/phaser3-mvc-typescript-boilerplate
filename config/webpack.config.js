const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const package = require('../package.json');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const parts = require('./webpack.parts.config'); // other functions for webpack config

const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/index.ts'),
  dist: path.resolve('www'),
  template: path.resolve('template/index.html'),
  tsConfigDev: path.resolve('tsconfig.dev.json'),
};
const libraryName = 'ScrabbleGame';

const mainConfigs = merge([
  parts.cleanup([paths.dist]),
  parts.injectVersion(package.version),
  parts.loadJs({}),
  {
    target: 'web',
    context: paths.base,
    entry: { app: paths.app },
    output: {
      library: libraryName,
      filename: libraryName + '.js',
      libraryTarget: 'umd',
      umdNamedDefine: false,
      path: paths.dist,
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(package.version),
      }),
      new HtmlWebpackPlugin({
        template: paths.template,
        title: package.name,
        version: package.version,
      }),
      new CaseSensitivePathsPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '../assets',
            to: 'assets',
          },
        ],
      }),
    ],
  },
]);

const developmentConfigs = merge([
  // parts.sourceMaps('inline-source-map'),
  parts.devServer({ host: process.env.HOST, port: process.env.PORT }),
  {
    plugins: [
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // include specific files based on a RegExp
        include: /src/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asynchronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '../template/css',
            to: 'css',
          },
        ],
      }),
    ],
  },
]);

const productionConfigs = merge([
  {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
            compress: {
              drop_console: true,
            },
            output: {
              comments: false,
              beautify: false,
            },
          },
          parallel: true,
          exclude: [/file\.css$/],
        }),
      ],
    },
  },
]);

module.exports = (env, launchConfig) => {
  const envName = env.local
    ? 'local'
    : env.development
    ? 'development'
    : 'production';
  const envConfig = parts.envVar(envName, launchConfig.mode);
  const modeConfig =
    launchConfig.env.development || launchConfig.env.local
      ? developmentConfigs
      : productionConfigs;
  const config = merge(mainConfigs, modeConfig, envConfig);
  return config;
};
