import { decryptObject, encryptObject } from './encryptObject'

test('encryptObject', async () => {
  const objects = [
    { string: 'test string', date: new Date(), regex: /foo/i, array: [1, 2, 3] },
    { number: 123, nested: { string: 'nested object' } },
    { foo1: 'bar1' },
    { foo2: 'bar2' },
  ]
  const password = 'password123'

  const data = await encryptObject(objects, password)
  expect(data.length).toBeGreaterThan(0)

  const readObjects = await decryptObject(password, data)
  expect(readObjects).toEqual(objects)
})
