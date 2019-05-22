/* tslint:disable:no-implicit-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { getTransformer } from 'ts-transform-graphql-tag'
import webpack from 'webpack'
import pkg from './package.json'
const WriteFilePlugin = require('write-file-webpack-plugin')

const appName = 'Ag'

const config: webpack.Configuration = {
  context: __dirname,
  name: 'index',
  target: 'electron-renderer',
  entry: `./src/index.ts`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
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
        options: {
          getCustomTransformers: () => ({ before: [getTransformer()] }),
        },

        // use: [
        //   { loader: 'babel-loader' }, //
        //   {
        //     loader: 'ts-loader',
        //     options: {
        //       getCustomTransformers: () => ({ before: [getTransformer()] }),
        //     },
        //   },
        // ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=font/[name].[ext]',
      },
    ],
  },
  plugins: [
    // create index.html
    new HtmlWebpackPlugin({
      title: `${appName} ${pkg.version}`,
      template: './src/template.html',
    }),

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/vendor-manifest.json'),
    }),

    // write the output files back to disk
    new WriteFilePlugin({
      test: /^((?!(hot-update)).)*$/,
    }),

    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: `stats-${name}.html`,
    //   openAnalyzer: false,
    // }),
  ],
  externals: {
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage', //
    sqlite3: 'commonjs sqlite3',
  },
}

module.exports = config
