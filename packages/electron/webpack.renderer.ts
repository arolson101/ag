/* tslint:disable:no-implicit-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { buildWebpackConfig } from '../../scripts/buildWebpackConfig'
import pkg from './package.json'

const appName = 'Ag'

const context = __dirname

module.exports = buildWebpackConfig({
  context,
  name: 'index',
  target: 'electron-renderer',
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
  ],
  devServer: {
    publicPath: '/',
    historyApiFallback: {
      disableDotRule: true,
    },
    stats: 'minimal',
  },
})
