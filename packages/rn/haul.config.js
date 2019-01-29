import { createWebpackConfig } from 'haul'

export default {
  webpack: env => {
    const config = createWebpackConfig(({ platform }) => {
      return {
        entry: `./index.ts`,
      }
    })(env)

    config.module.rules = [
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
    ]

    return config
  },
}
