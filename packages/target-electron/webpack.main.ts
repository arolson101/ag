/* tslint:disable:no-implicit-dependencies */
import path from 'path'
import webpack from 'webpack'

export const outputFilename = 'main.js'

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
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'ts-loader',
        options: {},
      },
    ],
  },
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer', //
  },
}

module.exports = config
