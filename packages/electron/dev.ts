/* tslint:disable:no-console no-implicit-dependencies */
import chalk from 'chalk'
import { ChildProcess, spawn } from 'child_process'
import os from 'os'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

const mode = 'development'
const port = 3456

let electronProcess: ChildProcess | undefined
let webpackWatching: webpack.Compiler.Watching | undefined
let server: WebpackDevServer | undefined

const channels = {
  webpack: chalk.dim.blue(`[webpack]`),
  electron: chalk.dim.cyan(`[electron]`),
  wds: chalk.blue(`[wds]`),
}

// https://github.com/webpack/webpack/blob/master/lib/Stats.js#L1394-L1401
const minimalStats: webpack.Stats.ToStringOptions = {
  colors: true,
  all: false,

  errors: true,
  warnings: true,
  errorDetails: true,

  modules: true,
  maxModules: 0,
  chunks: false,
}

const print = (channel: string, messages: string) => {
  if (typeof messages === 'string') {
    console.log(
      messages
        .split(/\r?\n/)
        .map(line => channel + ' ' + line)
        .join(os.EOL)
    )
  } else {
    console.log(channel, messages)
  }
}

const runElectron = () => {
  if (electronProcess) {
    electronProcess.kill()
  }
  const args = ['dist', '--url', `http://localhost:${port}`]
  print(channels.electron, 'electron ' + args.join(' '))
  electronProcess = spawn('electron', args)
  electronProcess.stdout.on('data', data => {
    print(channels.electron, data.toString())
  })
  electronProcess.stderr.on('data', data => {
    print(channels.electron, data.toString())
  })
  electronProcess.on('exit', code => {
    print(channels.electron, `exited with code ${code}`)
    electronProcess = undefined
    closeEverything()
  })
}

const runWebpackForMain = () => {
  print(channels.webpack, 'starting webpack')
  const mainConfig = require('./webpack.main')
  const compiler = webpack({ ...mainConfig, mode })
  webpackWatching = compiler.watch({}, (err, stats) => {
    if (err) {
      console.log('Error in main config: %o', err)
    }
    if (stats) {
      print(channels.webpack, stats.toString(minimalStats))
      if (!stats.hasErrors()) {
        // (re)start electron
        runElectron()
      }
    }
  })
}

const runWebpackDevServer = () => {
  const rendererConfig = require('./webpack.renderer')
  const config: webpack.Configuration = { ...rendererConfig, mode }
  const devConfig: WebpackDevServer.Configuration = {
    hot: true,
    historyApiFallback: true,
    port,
    publicPath: '/',
    contentBase: 'dist',
    stats: minimalStats,
  }
  const compiler = webpack(config)
  server = new WebpackDevServer(compiler, devConfig)
  server.listen(port, '127.0.0.1', () => {
    print(channels.wds, `Starting server on http://localhost:${port}`)
  })
}

const closeEverything = () => {
  if (webpackWatching) {
    webpackWatching.close(() => {
      print(channels.webpack, 'webpack closed')
    })
  }
  if (server) {
    server.close(() => {
      print(channels.wds, 'webpack dev server closed')
    })
  }
}

// checkVendorDll()
// checkSqlite()
runWebpackForMain()
runWebpackDevServer()
