/* tslint:disable:no-console no-implicit-dependencies */
import chalk from 'chalk'
import { ChildProcess, spawn } from 'child_process'
import electronRebuild from 'electron-rebuild'
import fs from 'fs'
import os from 'os'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import pkg from './package.json'
// import { outputFilename } from './webpack.main'

const appName = 'Ag-electron'

process.env.DEBUG = '*'

const devConfig: Partial<webpack.Configuration> = {
  mode: 'development',
  devtool: 'source-map',
}
const port = 3456

let electronProcess: ChildProcess | undefined
let webpackWatching: webpack.Compiler.Watching | undefined
let server: WebpackDevServer | undefined

const channels = {
  patch: chalk.dim.green(`[patch]`),
  dll: chalk.dim.green(`[dll]`),
  compile: chalk.dim.green(`[compile]`),
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

const wrapCmd = (name: string): string => {
  switch (os.platform()) {
    case 'win32':
      return `${name}.cmd`
    default:
      return name
  }
}

const patchPackage = () => {
  return new Promise((resolve, reject) => {
    const child = spawn(wrapCmd('patch-package'), { cwd: path.resolve(__dirname, '..', '..') })

    child.stdout!.on('data', data => {
      print(channels.patch, data.toString())
    })
    child.stderr!.on('data', data => {
      print(channels.patch, data.toString())
    })

    child.on('exit', code => {
      if (code === 0) {
        print(channels.patch, chalk.green('✓') + ` patched packages`)
        resolve()
      } else {
        closeEverything(channels.patch)
        reject(new Error(`patch-packages failed`))
      }
    })
  })
}

const checkVendorDll = async (promises: Array<Promise<any>>) => {
  await Promise.all(promises)

  return new Promise((resolve, reject) => {
    const configPath = './webpack.dll.ts'
    const vendorDllFile = './app/vendor.js' //
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
      const compiler = webpack({ ...config, ...devConfig })
      compiler.run((err, stats) => {
        print(channels.dll, stats.toString(minimalStats))
        if (err) {
          closeEverything(channels.dll)
          reject(new Error(`failed building vendor dll`))
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

const appPackageJson = async () => {
  // const appDir = path.join('.', 'dist')
  // if (!fs.existsSync(appDir)) {
  //   fs.mkdirSync(appDir)
  // }
  // const packageJson = path.join(appDir, 'package.json')
  // const content = JSON.stringify(
  //   {
  //     name: appName,
  //     version: pkg.version,
  //     main: outputFilename,
  //     dependencies: {
  //       sqlite3: pkg.dependencies.sqlite3,
  //     },
  //   },
  //   null,
  //   '  '
  // )
  // fs.writeFileSync(packageJson, content)
}

const checkSqlite = async (promises: Array<Promise<any>>) => {
  await Promise.all(promises)

  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(require.resolve('sqlite3'))) {
      reject(new Error('sqlite3 module not found'))
    }

    const sqlite3dir = path.dirname(require.resolve('sqlite3/package.json'))
    console.log(sqlite3dir)
    const libPath = path.join(
      sqlite3dir,
      'lib',
      'binding',
      `electron-v5.0-${os.platform()}-${os.arch()}`,
      'node_sqlite3.node'
    )
    if (!fs.existsSync(libPath)) {
      print(channels.compile, `${libPath} not found; building`)

      try {
        await electronRebuild({
          buildPath: sqlite3dir,
          useCache: false,
          force: true,
          electronVersion: pkg.dependencies.electron.replace('^', ''),
        })
      } catch (error) {
        reject(error)
      }

      if (fs.existsSync(libPath)) {
        print(channels.compile, chalk.green('✓') + ` built ${libPath}`)
        resolve()
      } else {
        closeEverything(channels.compile)
        reject(new Error(`building ${libPath} failed - file does not exist`))
      }
    } else {
      print(channels.compile, chalk.green('✓') + ` ${libPath}`)
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
  electronProcess = spawn(wrapCmd('electron'), args)
  electronProcess.stdout!.on('data', data => {
    print(channels.electron, data.toString())
  })
  electronProcess.stderr!.on('data', data => {
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
    const compiler = webpack({ ...mainConfig, ...devConfig /*, devServer: { hot: false }*/ })
    webpackWatching = compiler.watch({}, (err, stats) => {
      if (err) {
        console.log('Error in main config: %o', err)
        closeEverything(channels.webpack)
        reject(err)
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
        } else {
          closeEverything(channels.webpack)
          reject(err)
        }
      }
    })
  })
}

const runWebpackDevServer = async (promises: Array<Promise<any>>) => {
  await Promise.all(promises)
  return new Promise(resolve => {
    const host = 'localhost'
    const config: webpack.Configuration = { ...require('./webpack.renderer'), ...devConfig }
    const options: WebpackDevServer.Configuration = {
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      contentBase: './dist',
      port,
      host,
      stats: minimalStats,
    }
    WebpackDevServer.addDevServerEntrypoints(config as any, options)
    const compiler = webpack(config)
    server = new WebpackDevServer(compiler as any, options)
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

const patchPromise = patchPackage()
const vendorPromise = checkVendorDll([patchPromise])
const appPackageJsonPromise = appPackageJson()
const libPromise = checkSqlite([appPackageJsonPromise])
const wdsPromise = runWebpackDevServer([vendorPromise])
const mainPromise = runWebpackForMain([libPromise])
Promise.all([wdsPromise, mainPromise])
  .then(() => {
    runElectron()
  })
  .catch(err => {
    console.log(err)
  })
