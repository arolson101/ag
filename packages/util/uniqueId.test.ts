import { uniqueId } from './uniqueId'

test('uniqueId', () => {
  const length = 100
  const values = Array.from({ length }, uniqueId)
  expect(values).toHaveLength(length)

  for (const id of values) {
    expect(id.match(/^\w+$/))
    expect(id.indexOf('/')).toBe(-1)
    expect(id.indexOf(':')).toBe(-1)
    expect(id.indexOf('#')).toBe(-1)
    expect(id.indexOf('=')).toBe(-1)
    expect(id.indexOf('&')).toBe(-1)
  }

  const unique = [...new Set(values)]
  expect(unique).toEqual(values)
})
