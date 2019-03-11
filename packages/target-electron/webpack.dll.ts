/* tslint:disable:no-implicit-dependencies */
import path from 'path'
import webpack from 'webpack'
import electronpkg from './package.json'

const externals = [
  ...Object.keys(require('./webpack.main').externals), //
]

const isInternalProject = (name: string) => name.startsWith('@ag/')

const packages = Object.keys(electronpkg.dependencies)
  .flatMap(dep =>
    isInternalProject(dep)
      ? Object.keys(require(`${dep}/package.json`).dependencies) //
      : []
  )
  .filter(dep => !isInternalProject(dep))
  .filter(dep => !externals.includes(dep))
  .filter((dep, i, arr) => arr.indexOf(dep) === i)
  .sort()

// console.log('deps: ', packages)

const config: webpack.Configuration = {
  name: 'vendor',
  // mode: "development || "production",
  resolve: {
    aliasFields: [],
    extensions: ['.mjs', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
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
  target: 'electron-renderer',
  entry: {
    vendor: packages,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'vendor',
  },
  externals: {
    'electron-devtools-installer': 'commonjs electron-devtools-installer', //
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    sqlite3: 'commonjs sqlite3',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      name: 'vendor',
    }),
  ],
}

module.exports = config
