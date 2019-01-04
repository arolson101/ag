import { iupdate } from './iupdate'

test('$exclude', () => {
  const src = { foo: ['a', 'b', 'c'] }
  const res = iupdate(src, { foo: { $exclude: ['b'] } } as any)
  expect(res).toEqual({ foo: ['a', 'c'] })
})

test('$plus', () => {
  const src = { foo: 123, bar: [1, 2, 3] }
  const res = iupdate(src, { foo: { $plus: 50 } } as any)
  expect(res).toEqual({ foo: 173, bar: [1, 2, 3] })

  const res2 = iupdate(src, { foo: { $plus: -10 } } as any)
  expect(res2).toEqual({ foo: 113, bar: [1, 2, 3] })

  expect(() => iupdate(src, { foo: { $plus: [10] } } as any)).toThrow()
  expect(() => iupdate(src, { bar: { $plus: 10 } } as any)).toThrow()
})
