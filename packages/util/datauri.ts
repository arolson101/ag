const dataSig = 'data:'

type StringMap = Record<string, string>

export interface DataURIProps<T extends StringMap = StringMap> {
  mime: string
  attrs?: T
  buf: Buffer
}

export type DataUri<T extends StringMap = StringMap> = string & { __tag: T }

export const isDataUri = (str: string): str is DataUri => {
  return str.startsWith(dataSig)
}

export const encodeDataURI = <T extends StringMap = StringMap>(
  mime: string,
  buf: Buffer,
  attrs: T,
  encoding: string = 'base64'
): DataUri<T> => {
  const kvps = Object.keys(attrs || {}).map(key => `${key}=${attrs![key]}`)
  const mediaType = [mime, ...kvps].join(';')
  return `${dataSig}${mediaType};${encoding},${buf.toString(encoding)}` as DataUri<T>
}

const getInfo = <T extends StringMap>(input: DataUri<T>) => {
  const colon = input.indexOf(':')
  const semi = input.lastIndexOf(';')
  const comma = input.indexOf(',')
  const [mime, ...kvps] = input.substring(colon + 1, semi).split(';')
  const attrs = kvps.reduce(
    (obj, kvp) => {
      const [key, value] = kvp.split('=')
      obj[key] = value
      return obj
    },
    {} as T
  )
  const encoding = input.substring(semi + 1, comma) as BufferEncoding
  const data = input.substring(comma + 1)

  return { mime, encoding, data, attrs }
}

export const decodeDataUri = <T extends StringMap = StringMap>(input: DataUri<T>) => {
  const { mime, encoding, data, attrs } = getInfo(input)
  const buf = Buffer.from(data, encoding || undefined)
  return { mime, buf, attrs }
}

export const getDataURIAttribs = <T extends StringMap = StringMap>(input: DataUri<T>): T => {
  const { attrs } = getInfo(input)
  return attrs
}
