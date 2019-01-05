/* tslint:disable:no-implicit-dependencies */
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const WriteFilePlugin = require('write-file-webpack-plugin')
import path from 'path'

interface ConfigOptions {
  name: webpack.Configuration['name']
  context: string
  target: webpack.Configuration['target']
  plugins?: webpack.Configuration['plugins']
  devServer?: webpack.Configuration['devServer']
}

export const buildWebpackConfig = ({
  name,
  context,
  target,
  plugins,
  devServer,
}: ConfigOptions): webpack.Configuration & WebpackDevServer.Configuration => ({
  target,
  context,
  devtool: 'source-map',
  entry: `./src/${name}.ts`,
  output: {
    publicPath: '/',
    filename: `${name}.js`,
    devtoolModuleFilenameTemplate: info => {
      const rel = /*path.relative(context,*/ info.absoluteResourcePath /*)*/
      return `webpack:///${rel}`
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: [
          { loader: 'babel-loader' }, //
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
  plugins: [
    ...(plugins || []),
    new WriteFilePlugin({
      test: /^((?!(hot-update)).)*$/,
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: `stats-${name}.html`,
    //   openAnalyzer: false,
    // }),
  ],
  stats: 'minimal',
  devServer: {
    ...(devServer || {}),
    stats: 'minimal',
  },
})
