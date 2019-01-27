/* tslint:disable:no-implicit-dependencies */
import { buildWebpackConfig } from '../../scripts/buildWebpackConfig'
import pkg from './package.json'
const CreateFileWebpack = require('create-file-webpack')

const appName = 'Ag'

const context = __dirname

module.exports = buildWebpackConfig({
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
})
