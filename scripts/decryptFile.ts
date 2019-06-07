// tslint:disable: no-console
import fs from 'fs'
import process from 'process'
import { decryptObject, encryptObject } from '../packages/util'

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
  console.time('encryptObject')
  const data = await encryptObject(objects, password)
  console.timeEnd('encryptObject')
  fs.writeFileSync(encfile, data)
  console.log(`wrote ${encfile}`)
}

const testDecrypt = async () => {
  console.log(`decrypting ${encfile}`)
  const data = fs.readFileSync(encfile)
  console.time('decryptObject')
  const object = await decryptObject(password, data)
  console.timeEnd('decryptObject')
  fs.writeFileSync(decfile, JSON.stringify({ object }, null, '  '))
}
;(async () => {
  await testCreate()
  await testDecrypt()
})()
