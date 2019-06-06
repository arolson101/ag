// tslint:disable-next-line: no-implicit-dependencies
import MemoryStream from 'memorystream'
import { readObjectsFromStream, writeObjectsToStream } from './encryptedFile'

test('encryptedFile', async () => {
  const objects = [{ foo1: 'bar1' }, { foo2: 'bar2' }]
  let data: Buffer = Buffer.alloc(0)
  const password = 'password123'

  {
    const bufs = [] as Buffer[]
    const out = new MemoryStream()
    out.on('data', chunk => {
      bufs.push(chunk)
    })
    out.on('end', () => {
      data = Buffer.concat(bufs)
    })

    await writeObjectsToStream(objects, password, out)
    expect(data.length).toBeGreaterThan(0)
  }

  {
    const ins = new MemoryStream()
    ins.write(data)
    ins.end()

    const readObjects = await readObjectsFromStream(password, ins)
    expect(readObjects).toEqual(objects)
  }
})
