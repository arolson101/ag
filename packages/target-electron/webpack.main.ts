/* tslint:disable:no-implicit-dependencies */
import path from 'path'
import webpack from 'webpack'

import pkg from './package.json'

const CreateFileWebpack = require('create-file-webpack')

const appName = 'Ag-electron'

const outputFilename = 'main.js'

const config: webpack.Configuration = {
  context: __dirname,
  name: 'main',
  target: 'electron-main',
  entry: `./src/main.ts`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFilename,
    // devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',

    // devtoolModuleFilenameTemplate: info => {
    //   const rel = path.relative(path.join(context, '../..'), info.absoluteResourcePath)
    //   return `webpack:///${rel}`
    // },
  },
  resolve: {
    // mainFields: ['browser', 'main', 'module'],
    aliasFields: [],
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'ts-loader',
        options: {},
      },
    ],
  },
  plugins: [
    // create package.json
    new CreateFileWebpack({
      path: 'dist',
      fileName: 'package.json',
      content: JSON.stringify(
        {
          name: appName,
          version: pkg.version,
          main: outputFilename,
          dependencies: {
            sqlite3: pkg.dependencies.sqlite3,
          },
        },
        null,
        '  '
      ),
    }),
  ],
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer', //
  },
}

module.exports = config
