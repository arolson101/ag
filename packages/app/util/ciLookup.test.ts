import { ciLookup } from './ciLookup'

test('ciLookup', () => {
  const obj = { ABC: 'ABC' }
  const val = ciLookup(obj, 'aBc')
  expect(val).toEqual(obj.ABC)
})
