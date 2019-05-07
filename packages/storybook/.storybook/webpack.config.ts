/* tslint:disable:no-implicit-dependencies no-string-literal */
import { getTransformer } from 'ts-transform-graphql-tag'
import webpack from 'webpack'

interface Params {
  config: webpack.Configuration
  mode: webpack.Configuration['mode']
}

module.exports = async ({ config }: Params): Promise<webpack.Configuration> => {
  // config.target = 'web'

  config.module!.rules!.push(
    {
      test: /\.tsx?$/,
      exclude: ['/node_modules/', /test.ts/],
      loader: 'ts-loader',
      options: {
        getCustomTransformers: () => ({ before: [getTransformer()] }),
      },
    },
    // {
    //   test: /\.css$/,
    //   use: ['style-loader', 'css-loader'],
    // },
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader?name=font/[name].[ext]',
    }
  )

  config.resolve!.aliasFields = []
  config.resolve!.extensions!.push('.ts', '.tsx', '.electron.ts', '.electron.tsx')

  config.node = {
    fs: 'empty',
  }

  config.externals = {
    // ...config.externals,
    'electron-devtools-installer': 'commonjs electron-devtools-installer',
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
    sqlite3: 'commonjs sqlite3',
  }

  config.plugins = config.plugins || []
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, (result: any) => {
      result.request = result.request.replace(/typeorm/, 'typeorm/browser')
    })
  )

  return config
}
