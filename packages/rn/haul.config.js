import { createWebpackConfig } from 'haul'
import webpack from 'webpack'

export default {
  webpack: env => {
    const config = createWebpackConfig(({ platform }) => {
      return {
        entry: `./index.js`,
      }
    })(env)

    config.module.rules = [
      {
        test: /\.js?$/,
        include: [
          /node_modules\/native-base-shoutem-theme/, //
          /node_modules\/react-native-vector-icons/,
        ],
        loader: 'babel-loader',
        options: {
          presets: ['module:metro-react-native-babel-preset'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      ...config.module.rules,
    ]

    config.resolve.extensions = [
      '.ts',
      '.tsx',
      `.${env.platform}.ts`,
      '.native.ts',
      `.${env.platform}.tsx`,
      '.native.tsx',
      ...config.resolve.extensions,
      '.json',
    ]

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      fs: require.resolve('react-native-fs'),
      typeorm: require.resolve('typeorm/browser'),
    }

    config.externals = {
      ...config.externals,
    }

    // config.plugins = [
    //   ...config.plugins,
    //   new webpack.NormalModuleReplacementPlugin(/^fs$/, function (result) {
    //     result.request = result.request.replace(/^fs$/, "react-native-fs");
    //   })
    // ]

    return config
  },
}
