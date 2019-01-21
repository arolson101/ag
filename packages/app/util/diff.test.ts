import { diff } from './diff'
import { iupdate } from './iupdate'

test('diff', () => {
  const src = { a: 'a', b: 'b', c: 'c' }
  const next = { a: 'a', b: 'b2', c: 'c' }
  const d = diff(src, next)
  expect(d).toEqual({ b: { $set: 'b2' } })
  const res = iupdate(src, d)
  expect(res).toEqual(next)
})
