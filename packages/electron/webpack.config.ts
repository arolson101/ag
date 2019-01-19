/* tslint:disable:no-implicit-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { buildWebpackConfig } from '../../scripts/buildWebpackConfig'
import pkg from './package.json'
const CreateFileWebpack = require('create-file-webpack')

const appName = 'Ag'

const context = __dirname

module.exports = [
  buildWebpackConfig({
    context,
    name: 'main',
    target: 'electron-main',
    plugins: [
      // create package.json
      new CreateFileWebpack({
        path: 'dist',
        fileName: 'package.json',
        content: JSON.stringify(
          {
            name: appName,
            version: pkg.version,
            main: 'main.js',
            dependencies: {
              sqlite3: pkg.dependencies.sqlite3,
            },
          },
          null,
          '  '
        ),
      }),
    ],
    devServer: {
      // prevent HMR stuff getting added
      inline: false,
      stats: 'minimal',
    },
  }),

  buildWebpackConfig({
    context,
    name: 'index',
    target: 'electron-renderer',
    plugins: [
      // create index.html
      new HtmlWebpackPlugin({
        title: `${appName} ${pkg.version}`,
        template: './src/template.html',
      }),
    ],
    devServer: {
      publicPath: '/',
      historyApiFallback: {
        disableDotRule: true,
      },
      stats: 'minimal',
    },
  }),
]
