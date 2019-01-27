/* tslint:disable:no-implicit-dependencies */
import { getTransformer } from 'ts-transform-graphql-tag'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const WriteFilePlugin = require('write-file-webpack-plugin')

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
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
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
    historyApiFallback: true,
  },
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer',
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    sqlite3: 'commonjs sqlite3',
  },
})
