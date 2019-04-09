import { iupdate } from './iupdate'

test('$exclude', () => {
  const src = { foo: ['a', 'b', 'c'] }
  const res = iupdate(src, { foo: { $exclude: ['b'] } })
  expect(res).toEqual({ foo: ['a', 'c'] })
})

test('$plus', () => {
  expect(iupdate(2, { $plus: 3 })).toEqual(5)

  const src = { foo: 123, bar: [1, 2, 3] }
  const res = iupdate(src, { foo: { $plus: 50 } })
  expect(res).toEqual({ foo: 173, bar: [1, 2, 3] })

  const res2 = iupdate(src, { foo: { $plus: -10 } })
  expect(res2).toEqual({ foo: 113, bar: [1, 2, 3] })

  expect(() => iupdate(src, { foo: { $plus: [10] } } as any)).toThrow()
  expect(() => iupdate(src, { bar: { $plus: 10 } } as any)).toThrow()
})
