import { dehydrate, hydrate } from './dehydrate'

test('dehydrate', () => {
  const obj = { foo: 'bar', baz: 123, array: [1, 2, 3] }
  const archive = dehydrate(obj)
  const newobj = hydrate(archive)
  expect(newobj).toEqual(obj)
})
