/* tslint:disable:no-implicit-dependencies */
import path from 'path'
import webpack from 'webpack'

import apppkg from '../app/package.json'
import electronpkg from './package.json'

const mainProcessDeps = ['commander', 'electron-is-dev', 'electron-window-state']

const packages = Object.keys({
  ...apppkg.dependencies,
  ...electronpkg.dependencies,
})
  .filter(dep => !dep.startsWith('@ag/'))
  .filter(dep => !mainProcessDeps.includes(dep))

const config: webpack.Configuration = {
  name: 'vendor',
  // mode: "development || "production",
  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
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
  target: 'electron-renderer',
  entry: {
    vendor: packages,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'vendor',
  },
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer', //
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    sqlite3: 'commonjs sqlite3',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      name: 'vendor',
    }),
  ],
}

module.exports = config
