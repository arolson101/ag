import { iupdate } from './iupdate'

test('iupdate', () => {
  const src = { foo: ['a', 'b', 'c'] }
  const res = iupdate(src, { foo: { $exclude: ['b'] } } as any)
  expect(res).toEqual({ foo: ['a', 'c'] })
})
