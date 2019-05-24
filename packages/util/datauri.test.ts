import { DataURI, DataURIProps, decodeDataURI, encodeDataURI, getDataURIAttribs } from './datauri'

test.only('simple', () => {
  const uri = 'data:text/vnd-example+xyz;base64,R0lGODdh' as DataURI
  const vals = decodeDataURI(uri)
  expect(vals).toHaveProperty('mime', 'text/vnd-example+xyz')
  expect(vals).toHaveProperty('buf')
  expect(vals.buf).toEqual(Buffer.from('R0lGODdh', 'base64'))
  expect(vals).toHaveProperty('attrs')
  expect(vals.attrs).toEqual({})

  const newUri = encodeDataURI(vals)
  expect(newUri).toEqual(uri)
})

test.only('attributes', () => {
  const uri = 'data:text/vnd-example+xyz;foo=bar;baz=123;base64,R0lGODdh' as DataURI
  const vals = decodeDataURI(uri)
  expect(vals).toHaveProperty('mime', 'text/vnd-example+xyz')
  expect(vals).toHaveProperty('buf')
  expect(vals.buf).toEqual(Buffer.from('R0lGODdh', 'base64'))
  expect(vals).toHaveProperty('attrs')
  expect(vals.attrs).toEqual({ foo: 'bar', baz: '123' })

  const newUri = encodeDataURI(vals)
  expect(newUri).toEqual(uri)
})

test('image', () => {
  const uri = encodeDataURI({
    mime: 'image/png',
    buf: Buffer.from('12345'),
    attrs: { width: '100', height: '150' },
  })

  const attrs = getDataURIAttribs(uri)
  expect(attrs.width).toBe('100')
  expect(attrs.height).toBe('150')
})
