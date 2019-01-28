/* tslint:disable:no-console no-implicit-dependencies */
import chalk from 'chalk'
import { ChildProcess, spawn, spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

const mode = 'development'
const port = 3456

let electronProcess: ChildProcess | undefined
let webpackWatching: webpack.Compiler.Watching | undefined
let server: WebpackDevServer | undefined

const channels = {
  dll: chalk.dim.green(`[dll]`),
  lib: chalk.dim.magenta(`[lib]`),
  webpack: chalk.rgb(83, 154, 199)(`[main]`),
  electron: chalk.rgb(160, 234, 249)(`[electron]`),
  wds: chalk.rgb(115, 175, 203)(`[wds]`),
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

const checkVendorDll = () => {
  return new Promise(resolve => {
    const configPath = './webpack.dll.ts'
    const vendorDllFile = './dist/vendor.js' //
    const dependencies = [
      './package.json', //
      '../../package.json',
      configPath,
    ]

    const vendorTime = fs.existsSync(vendorDllFile) ? fs.statSync(vendorDllFile).mtimeMs : 0
    const packageTime = Math.max(...dependencies.map(f => fs.statSync(f).mtimeMs))
    if (packageTime > vendorTime) {
      print(channels.dll, `${vendorDllFile} is out of date; rebuilding`)
      const config = require(configPath)
      const compiler = webpack({ ...config, mode })
      compiler.run((err, stats) => {
        print(channels.dll, stats.toString(minimalStats))
        if (err) {
          closeEverything(channels.dll)
          throw new Error(`failed building vendor dll`)
        }
        print(channels.dll, chalk.green('✓') + ` built ${vendorDllFile}`)
        resolve()
      })
    } else {
      print(channels.dll, chalk.green('✓') + ` ${vendorDllFile}`)
      resolve()
    }
  })
}

const checkSqlite = () => {
  return new Promise(resolve => {
    const libPath = path.join(
      '.',
      'node_modules',
      'sqlite3',
      'lib',
      'binding',
      `electron-v4.0-${os.platform()}-${os.arch()}`,
      'node_sqlite3.node'
    )
    if (!fs.existsSync(libPath)) {
      print(channels.lib, `${libPath} not found; building`)
      const child = spawn('electron-builder', ['install-app-deps'])

      child.stdout.on('data', data => {
        print(channels.lib, data.toString())
      })
      child.stderr.on('data', data => {
        print(channels.lib, data.toString())
      })

      child.on('exit', code => {
        if (code === 0) {
          print(channels.lib, chalk.green('✓') + ` built ${libPath}`)
          resolve()
        } else {
          closeEverything(channels.lib)
          throw new Error(`building ${libPath} failed`)
        }
      })
    } else {
      print(channels.lib, chalk.green('✓') + ` ${libPath}`)
      resolve()
    }
  })
}

const electronExit = (code: number) => {
  print(channels.electron, `exited with code ${code}`)
  electronProcess = undefined
  closeEverything(channels.electron)
}

const runElectron = () => {
  if (electronProcess) {
    electronProcess.off('exit', electronExit)
    electronProcess.kill()
  }

  const args = ['--remote-debugging-port=9223', 'dist', '--url', `http://localhost:${port}`]
  print(channels.electron, 'electron ' + args.join(' '))
  electronProcess = spawn('electron', args)
  electronProcess.stdout.on('data', data => {
    print(channels.electron, data.toString())
  })
  electronProcess.stderr.on('data', data => {
    print(channels.electron, data.toString())
  })
  electronProcess.on('exit', electronExit)
}

const runWebpackForMain = async (promises: Array<Promise<any>>) => {
  await Promise.all(promises)
  let resolved: boolean = false
  return new Promise((resolve, reject) => {
    print(channels.webpack, 'starting webpack')
    const mainConfig = require('./webpack.main')
    const compiler = webpack({ ...mainConfig, mode })
    webpackWatching = compiler.watch({}, (err, stats) => {
      if (err) {
        console.log('Error in main config: %o', err)
        closeEverything(channels.webpack)
        throw err
      }
      if (stats) {
        print(channels.webpack, stats.toString(minimalStats))
      }

      if (!resolved) {
        resolved = true
        resolve()
      } else {
        if (!stats.hasErrors()) {
          // restart electron
          runElectron()
        }
      }
    })
  })
}

const runWebpackDevServer = async (promises: Array<Promise<any>>) => {
  await Promise.all(promises)
  return new Promise(resolve => {
    const host = 'localhost'
    const config: webpack.Configuration = { ...require('./webpack.renderer'), mode }
    const options: WebpackDevServer.Configuration = {
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      contentBase: './dist',
      port,
      host,
      stats: minimalStats,
    }
    WebpackDevServer.addDevServerEntrypoints(config, options)
    config.plugins = [
      ...(config.plugins || []), //
      new webpack.HotModuleReplacementPlugin(),
    ]
    const compiler = webpack(config)
    server = new WebpackDevServer(compiler, options)
    server.listen(port, host, () => {
      print(channels.wds, `dev server listening on http://${host}:${port}`)
      resolve()
    })
  })
}

const closeEverything = (channel: string) => {
  print(channel, 'closing everything')
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

const vendorPromise = checkVendorDll()
const libPromise = checkSqlite()
const wdsPromise = runWebpackDevServer([vendorPromise])
const mainPromise = runWebpackForMain([libPromise])
Promise.all([wdsPromise, mainPromise]).then(() => {
  runElectron()
})
