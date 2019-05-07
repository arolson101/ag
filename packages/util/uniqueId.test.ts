import { uniqueId } from './uniqueId'

test('uniqueId', () => {
  const id = uniqueId()
  expect(id.indexOf('/')).toBe(-1)
  expect(id.indexOf(':')).toBe(-1)
  expect(id.indexOf('#')).toBe(-1)
  expect(id.indexOf('=')).toBe(-1)
  expect(id.indexOf('&')).toBe(-1)
  expect(uniqueId()).not.toEqual(id)
})
