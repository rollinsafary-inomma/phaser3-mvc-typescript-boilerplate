const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const package = require('../package.json');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const parts = require('./webpack.parts.config'); // other functions for webpack config

const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/index.ts'),
  dist: path.resolve('www'),
  template: path.resolve('template/index.html'),
  tsConfigDev: path.resolve('tsconfig.dev.json'),
};

const mainConfigs = merge([
  parts.cleanup([paths.dist]),
  parts.injectVersion(package.version),
  parts.loadJs({}),
  {
    target: 'web',
    context: paths.base,
    entry: paths.app,
    output: {
      filename: '[name].js',
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
      new CopyWebpackPlugin([
        {
          from: '../assets',
          to: 'assets',
        },
        {
          from: '../template/css',
          to: 'css',
        },
      ]),
    ],
  },
]);

const developmentConfigs = merge([
  parts.sourceMaps('inline-source-map'),
  parts.devServer({ host: process.env.HOST, port: process.env.PORT }),
]);

const productionConfigs = merge([
  {
    optimization: {
      runtimeChunk: 'single',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
            compress: {
              drop_console: true,
            },
            extractComments: false,
            output: {
              comments: false,
              beautify: false,
            },
          },
          parallel: true,
          exclude: [/file\.css$/],
        }),
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              // settings npm packages into libs directory webpack will automatically create true reference
              return `libs/${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  },
]);

module.exports = (env, modeConfigs) => {
  //@env type is string, --env value in package.json script
  //@mode type is IWebpackMode, see end of file, generated based on --mode value in package.json script

  const envConfig = parts.envVar(modeConfigs.mode);
  const modeConfig =
    modeConfigs.mode === 'development' ? developmentConfigs : productionConfigs;
  const config = merge(mainConfigs, modeConfig, envConfig);
  return config;
};

// interface IWebpackMode {
//   cache: null,
//   bail: null,
//   profile: null,
//   color: { level: number, hasBasic: boolean, has256: number, has16m: boolean },
//   colors: { level: number, hasBasic: boolean, has256: number, has16m: boolean },
//   liveReload: boolean,
//   serveIndex: boolean,
//   inline: boolean,
//   info: boolean,
//   config: string, // path to config
//   env: string, // --env value in package json script
//   mode: string, // only development or production
//   host: string, // --host value in package json script
//   https: boolean, // --https existance in package json script
//   infoVerbosity: string,
//   clientLogLevel: string,
// }
