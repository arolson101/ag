import { DataUri, decodeDataUri, encodeDataURI, getDataURIAttribs } from './datauri'

test('simple', () => {
  const uri = 'data:text/vnd-example+xyz;base64,R0lGODdh' as DataUri
  const vals = decodeDataUri(uri)
  expect(vals).toHaveProperty('mime', 'text/vnd-example+xyz')
  expect(vals).toHaveProperty('buf')
  expect(vals.buf).toEqual(Buffer.from('R0lGODdh', 'base64'))
  expect(vals).toHaveProperty('attrs')
  expect(vals.attrs).toEqual({})

  const newUri = encodeDataURI(vals.mime, vals.buf, vals.attrs)
  expect(newUri).toEqual(uri)
})

test('attributes', () => {
  const uri = 'data:text/vnd-example+xyz;foo=bar;baz=123;base64,R0lGODdh' as DataUri
  const vals = decodeDataUri(uri)
  expect(vals).toHaveProperty('mime', 'text/vnd-example+xyz')
  expect(vals).toHaveProperty('buf')
  expect(vals.buf).toEqual(Buffer.from('R0lGODdh', 'base64'))
  expect(vals).toHaveProperty('attrs')
  expect(vals.attrs).toEqual({ foo: 'bar', baz: '123' })

  const newUri = encodeDataURI(vals.mime, vals.buf, vals.attrs)
  expect(newUri).toEqual(uri)
})

test('image', () => {
  // tslint:disable-next-line:max-line-length
  const uri = 'data:image/png;width=32;height=32;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACl0lEQVR4AcXBMWscRxiA4XeW2VKVrlIRUlxqIb4rlqv0F9ylumIRe5gp07hQoeIKNy6XMIPYwkVq/wRBwAyBD0WQ8kABQwLBlVVeMbndLMdmkUmUYO3zGGstU8qYWMbEMiaWMbGMiVn+p12Mic0GPnwAVQ5EQASk4tO333B8fGx4hLHW8l/sYkxsNvDuHQciHKhyIALekxeFYcRYa3mqXV0n1ms6IlBV5M4ZRnZ1nQgBVOl4T+6cYcBYa3mK3avLxOaKTlWRN41hoCxjOr+Ys1rODL3dq8vE5orO5RX5642hl/FUf/wGVQXekzeNYeD0NKYQlIfbLUP5643Be6gq+OVnhixPlDeNodU0fM7R2Zyx3DnDI4y1lrEYdykERZWOCDRNYeiVZUzsVZVQFLl5+/5jurneEgJ7ioggAiLgXGHYK8uY2GuawjBgGSnLmBaLwJAqezH98NOc1XJmQmBPEaHz5uUWVeUvgqqiCiJCK8ZdWiwCLWv5G8tAWcYUgtISEaqKTgigqtxc0xEBVTg6m9P67vs5D7ewDoAqVSWIwNHZnNWSAWHM0otxlxYLpeW94FxhnOPA+5icKwyPWC1nhj05jUmB84s5q+XM8C9k9FQVUBDBucIw4lxh+AIyeqp0KuFZZYyo8qwyeucXc1qqynPK6K2WMwNCqyxjYqQsY+ILsAx4D+s1hKBATFVFJwQIQRGJ6e6uMPyDNy+31HVMIcDdXWH4ms/KGHCuMN4LIgIoISghKKCICN4LLeVx3gstVWW9Vg5+paeMGWstY/f39+nH34+4ud7SOr+Ys1rODL237z+mh9stL158xcnJiWGkrmNiz7nC0KvrmI7O5qyWM8OAsdYypYyJZUwsY2IZE8uYWMbEMib2J2Tx9ZNXxshWAAAAAElFTkSuQmCC' as DataUri

  const attrs = getDataURIAttribs(uri)
  expect(attrs.width).toBe('32')
  expect(attrs.height).toBe('32')
})
