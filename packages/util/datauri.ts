const dataSig = 'data:'

type StringMap = Record<string, string>

export interface DataURIProps<T extends StringMap = StringMap> {
  mime: string
  attrs?: T
  buf: Buffer
}

export type DataURI<T extends StringMap = StringMap> = string & { __tag: T }

export const isDataURI = (str: string): boolean => {
  return str.startsWith(dataSig)
}

export const encodeDataURI = <T extends StringMap = StringMap>(
  props: DataURIProps<T>,
  encoding: string = 'base64'
): DataURI<T> => {
  const kvps = Object.keys(props.attrs || {}).map(key => `${key}=${props.attrs![key]}`)
  const mediaType = [props.mime, ...kvps].join(';')
  return `${dataSig}${mediaType};${encoding},${props.buf.toString(encoding)}` as DataURI<T>
}

const getInfo = <T extends StringMap>(input: DataURI<T>) => {
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

export const decodeDataURI = <T extends StringMap = StringMap>(
  input: DataURI<T>
): DataURIProps<T> => {
  const { mime, encoding, data, attrs } = getInfo(input)
  const buf = Buffer.from(data, encoding || undefined)
  return { mime, buf, attrs }
}

export const getDataURIAttribs = <T extends StringMap = StringMap>(input: DataURI<T>): T => {
  const { attrs } = getInfo(input)
  return attrs
}
