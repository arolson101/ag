import { Configuration } from 'webpack'

const config: Configuration = {
  devtool: "inline-source-map",
  mode: "development",
  entry: './index.ts',
  output: {
    filename: "bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' }
        ],
      }
    ]
  }
}

module.exports = config
