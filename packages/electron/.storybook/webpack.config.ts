/* tslint:disable:no-implicit-dependencies */
import { getTransformer } from 'ts-transform-graphql-tag'
import webpack from 'webpack'

module.exports = {
  plugins: [
    // your custom plugins
  ],
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
}
