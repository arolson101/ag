/* tslint:disable:no-implicit-dependencies */
import { getTransformer } from 'ts-transform-graphql-tag'
import webpack from 'webpack'

const config: webpack.Configuration = {
  resolve: {
    aliasFields: [],
    extensions: ['.ts', '.tsx', '.electron.ts', '.electron.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  target: 'web',
  module: {
    rules: [
      // {
      //   test: /\.mjs$/,
      //   include: /node_modules/,
      //   type: 'javascript/auto',
      // },
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({ before: [getTransformer()] }),
        },
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=font/[name].[ext]',
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer',
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    sqlite3: 'commonjs sqlite3',
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, (result: any) => {
      result.request = result.request.replace(/typeorm/, 'typeorm/browser')
    }),
  ],
}

module.exports = config
