/* eslint-disable require-jsdoc */
const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

function config(env) {
  const dir = path.resolve(__dirname, path.dirname(pkg.umd));
  const file = path.basename(pkg.umd);

  const cfg = {
    entry: './src/index.tsx',
    output: {
      path: dir,
      filename: file
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /TERMS.md/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'legal'
          }
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            configFile: env.production ? 'tsconfig.prod.json' : 'tsconfig.dev.json'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, 'images/svg/favicon.svg'),
        outputPath: path.resolve(dir, 'images/favicon'),
        prefix: 'images/favicon/',
        favicons: {
          appName: pkg.name,
          appDescription: pkg.description,
          developerName: pkg.author
        }
      })
    ],
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
      usedExports: true
    },
    devServer: {
      host: '0.0.0.0',
      compress: false,
      allowedHosts: 'all',
      port: 8080
    },
    performance: {
      hints: false
    }
  };

  if (env.production) {
    cfg.mode = 'production';
    delete cfg.devtool;
    delete cfg.optimization;
    delete cfg.devServer;
  }

  return cfg;
}

module.exports = config;
