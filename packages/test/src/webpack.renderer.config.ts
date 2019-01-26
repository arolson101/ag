// tslint:disable:no-implicit-dependencies
import webpack from 'webpack'
const webpackRenderer = require('electron-webpack/webpack.renderer.config.js')

const config = (env: any) => {
  return new Promise<webpack.Configuration>(async (resolve, reject) => {
    /* get provided config */
    const rendererConfig = (await webpackRenderer(env)) as webpack.Configuration

    /* add `raw-loader` */
    rendererConfig.module!.rules.push({
      test: /\.txt$/,
      use: 'raw-loader',
    })

    /* return modified config to webpack */
    resolve(rendererConfig)
  })
}

module.exports = config
