// tslint:disable:no-implicit-dependencies no-console
import depcheck from 'depcheck'
import fs from 'fs'
import Path from 'path'

interface PackageJson {
  name: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

;(async () => {
  const packagesDir = Path.join(__dirname, '..', 'packages')

  let dependencies: Record<string, string> = {}

  const dirs = fs.readdirSync(packagesDir).filter(dir => !dir.startsWith('.'))

  for (const dir of dirs) {
    // console.log(dir)
    const path = Path.join(packagesDir, dir, 'package.json')
    if (fs.existsSync(path)) {
      const packageJson = require(path) as PackageJson
      dependencies = {
        ...dependencies,
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      }
    }
  }
  console.log(`${Object.keys(dependencies).length} packages found in ${dirs.length} packages`)

  for (const dir of dirs) {
    await depcheck(
      Path.join(packagesDir, dir),
      {
        ignoreMatches: [
          'utility-types',
          '@2fd/graphdoc',
          'cross-env',
          'sqlite3',
          'electron-builder',
          'react-dom',
          'prop-types',

          'jest',

          // index.js
          'abortcontroller-polyfill',
          'array.prototype.flatmap',
          'node-libs-react-native',

          // needed by typeorm/browser
          'react-native-sqlite-storage',

          // rn-cli.config.js
          'react-native-typescript-transformer',
          'metro-react-native-babel-preset',
          'react-native-fs',
          'vm-browserify',
          'react-native-stream',
        ],
        specials: [
          // the target special parsers
          depcheck.special.bin,
          depcheck.special.eslint,
          // depcheck.special.webpack,
          depcheck.special.babel,
        ],
      },
      unused => {
        const cwd = Path.join(packagesDir, dir)
        const path = Path.join(cwd, 'package.json')
        console.log(`processing ${path}`)

        const packageJson = require(path) as PackageJson

        if (unused.invalidDirs.length) {
          throw new Error('invalid dirs: ' + unused.invalidDirs.join(', '))
        }
        if (unused.invalidFiles.length) {
          throw new Error('invalid files: ' + unused.invalidFiles.join(', '))
        }

        if (!packageJson.dependencies) {
          packageJson.dependencies = {}
        }

        if (!packageJson.devDependencies) {
          packageJson.devDependencies = {}
        }

        const neededTypes = Object.keys(unused.using)
          .concat(
            Object.keys(packageJson.dependencies).filter(dep => !unused.dependencies.includes(dep))
          )
          .map(getTypeNameForPackage)
          .filter(dep => dependencies[dep])
        // console.log({ neededTypes })

        // add @types/pkgname to devDependencies
        unused.devDependencies = unused.devDependencies.filter(dep => !neededTypes.includes(dep))

        let write = false
        for (const dep of unused.dependencies) {
          delete packageJson.dependencies![dep]
          write = true
          console.log(`  removing unused dep: ${dep}`)
        }

        for (const dep of unused.devDependencies) {
          delete packageJson.devDependencies![dep]
          write = true
          console.log(`  remove unused devDep: ${dep}`)
        }

        for (const pkg of neededTypes) {
          if (!packageJson.devDependencies[pkg]) {
            packageJson.devDependencies[pkg] = dependencies[pkg]
            console.log(`  adding missing devDep: ${pkg}`)
            write = true
          }
        }

        for (const pkg of Object.keys(unused.missing)) {
          if (!packageJson.dependencies[pkg]) {
            packageJson.dependencies[pkg] = dependencies[pkg]
            console.log(`  adding missing dep: ${pkg}`)
            write = true
          }
        }

        if (write) {
          packageJson.dependencies = sortObject(packageJson.dependencies)
          packageJson.devDependencies = sortObject(packageJson.devDependencies)
          fs.writeFileSync(
            path,
            JSON.stringify(packageJson, null, '  ') + '\n' // + JSON.stringify(unused, null, '  ')
          )
        }
      }
    )
  }
})()

const sortObject = (obj: Record<string, any>): Record<string, any> => {
  return Object.keys(obj)
    .sort()
    .reduce(
      (sortedObj, key) => {
        sortedObj[key] = obj[key]
        return sortedObj
      },
      {} as Record<string, any>
    )
}

const getTypeNameForPackage = (name: string): string => {
  if (name.startsWith('@')) {
    return `@types/${name.replace('@', '').replace('/', '__')}`
  } else {
    return `@types/${name}`
  }
}
