// tslint:disable:no-implicit-dependencies no-console
import depcheck from 'depcheck'
import fs from 'fs'
import Path from 'path'

//
;(async () => {
  const packagesDir = Path.join(__dirname, '..', 'packages')

  let dependencies: Record<string, string> = {}

  const dirs = fs.readdirSync(packagesDir).filter(dir => !dir.startsWith('.'))

  for (const dir of dirs) {
    // console.log(dir)
    const path = Path.join(packagesDir, dir, 'package.json')
    if (fs.existsSync(path)) {
      const packageJson = require(path)
      dependencies = {
        ...dependencies,
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      }
    }
  }
  console.log(`${Object.keys(dependencies).length} packages found in ${dirs.length} packages`)

  for (const dir of dirs) {
    console.log(`processing ${dir}`)
    await depcheck(Path.join(packagesDir, dir), {}, unused => {
      if (unused.invalidDirs.length) {
        throw new Error('invalid dirs: ' + unused.invalidDirs.join(', '))
      }
      if (unused.invalidFiles.length) {
        throw new Error('invalid files: ' + unused.invalidFiles.join(', '))
      }

      const missingDeps = Object.keys(unused.missing)
      if (missingDeps.length) {
        const path = Path.join(packagesDir, dir, 'package.json')
        const packageJson = require(path)
        for (const pkg of missingDeps) {
          packageJson.dependencies[pkg] = dependencies[pkg]
        }
        packageJson.dependencies = sortObject(packageJson.dependencies)
        fs.writeFileSync(path, JSON.stringify(packageJson, null, '  ') + '\n')
        console.log(`  added ${missingDeps.length} missing dependencies`)
      }

      for (const dep of unused.dependencies) {
        console.log(`  unused dep: ${dep}`)
      }

      for (const dep of unused.devDependencies) {
        console.log(`  unused devDep: ${dep}`)
      }
    })
  }
})()

const sortObject = <T extends Record<string, any>>(obj: T): T => {
  return Object.keys(obj)
    .sort()
    .reduce(
      (sortedObj, key) => {
        sortedObj[key] = obj[key]
        return sortedObj
      },
      {} as T
    )
}
