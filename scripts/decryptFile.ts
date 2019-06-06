// tslint:disable: no-console
import fs from 'fs'
import process from 'process'
import { readObjectsFromStream, writeObjectsToStream } from '../packages/util'

const password = 'password123'
const encfile = 'foo.zz'
const decfile = 'foo.txt'

const testCreate = async () => {
  const objects: any[] = [
    { string: 'test string', date: new Date(), regex: /foo/i, array: [1, 2, 3] },
    { number: 123, nested: { string: 'nested object' } },
  ]
  for (let i = 0; i < 100000; i++) {
    objects.push({ name: `object ${i}`, value: i, 'another value': `foo ${i}` })
  }
  const ws = fs.createWriteStream(encfile)
  console.time('writeObjectsToStream')
  await writeObjectsToStream(objects, password, ws)
  console.timeEnd('writeObjectsToStream')
  console.log(`wrote ${encfile}`)
}

const testDecrypt = async () => {
  console.log(`decrypting ${encfile}`)
  const rs = fs.createReadStream(encfile)
  console.time('readObjectsFromStream')
  const objects = await readObjectsFromStream(password, rs)
  console.timeEnd('readObjectsFromStream')
  fs.writeFileSync(decfile, JSON.stringify({ objects }, null, '  '))
}
;(async () => {
  await testCreate()
  await testDecrypt()
})()
