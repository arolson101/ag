import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const CreateFileWebpack = require('create-file-webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
import pkg from "./package.json";

interface BuildConfigOptions {
  name: string
  target: webpack.Configuration['target']
  plugins?: webpack.Configuration['plugins']
  devServer?: webpack.Configuration['devServer']
}

const buildConfig = ({name, target, plugins, devServer}: BuildConfigOptions): webpack.Configuration & WebpackDevServer.Configuration => ({
  target,
  devtool: 'inline-source-map',
  entry: `./src/${name}.ts`,
  output: {
    publicPath: '/',
    filename: `${name}.js`
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' }
        ],
      }
    ]
  },
  plugins: [
    ...(plugins || []),
    new WriteFilePlugin({
      test: /^((?!(hot-update)).)*$/
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: `stats-${name}.html`,
    //   openAnalyzer: false,
    // }),
  ],
  externals: {
    'devtron': 'commonjs devtron',
    'electron-react-devtools': 'commonjs electron-react-devtools',
  },
  stats: 'minimal',
  devServer,
})

module.exports = [
  buildConfig({
    name: 'main',
    target: 'electron-main',
    plugins: [
      // create package.json
      new CreateFileWebpack({
        path: 'dist',
        fileName: 'package.json',
        content: JSON.stringify({
          name: pkg.name,
          version: pkg.version,
          main: 'main.js'
        }, null, '  ')
      })
    ],
    devServer: {
      // prevent HMR stuff getting added
      inline: false,
      stats: 'minimal',
    }
  }),

  buildConfig({
    name: 'index',
    target: 'electron-renderer',
    plugins: [
      // create index.html
      new HtmlWebpackPlugin({
        title: '[Ag]',
      }),
    ],
    devServer: {
      publicPath: '/',
      historyApiFallback: {
        disableDotRule: true
      },
      stats: 'minimal',
    }
  }),
]
