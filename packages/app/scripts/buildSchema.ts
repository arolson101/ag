/* tslint:disable:no-console no-implicit-dependencies */
import program from 'commander'
import fs from 'fs'
import { getIntrospectionQuery, graphqlSync } from 'graphql'
import path from 'path'
import { schema } from '../db'

let outFile: string | undefined

program
  .arguments('<output-file>')
  .action(out => {
    outFile = out
  })
  .on('--help', () => {
    console.log('')
    console.log('output-file should probably be dist/schema.json')
  })
  .parse(process.argv)

if (!outFile) {
  console.error('output file not specified')
  program.help()
  throw null // unreachable
}

const result = graphqlSync(schema, getIntrospectionQuery({ descriptions: true }))
const dir = path.dirname(outFile)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

fs.writeFileSync(outFile, JSON.stringify(result, null, '  '))