import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const WriteFilePlugin = require('write-file-webpack-plugin')

interface ConfigOptions {
  name: string
  target: webpack.Configuration['target']
  plugins?: webpack.Configuration['plugins']
  devServer?: webpack.Configuration['devServer']
}

export const buildWebpackConfig = ({
  name,
  target,
  plugins,
  devServer,
}: ConfigOptions): webpack.Configuration & WebpackDevServer.Configuration => ({
  target,
  devtool: 'inline-source-map',
  entry: `./src/${name}.ts`,
  output: {
    publicPath: '/',
    filename: `${name}.js`,
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
  externals: {
    devtron: 'commonjs devtron',
    'electron-react-devtools': 'commonjs electron-react-devtools',
  },
  stats: 'minimal',
  devServer: {
    ...(devServer || {}),
    stats: 'minimal',
  },
})
