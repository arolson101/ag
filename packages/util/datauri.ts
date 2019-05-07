const dataSig = 'data:'

export interface DataURIProps {
  mime: string
  buf: Buffer
}

export const isDataURI = (str: string): boolean => {
  return str.startsWith(dataSig)
}

export const encodeDataURI = (props: DataURIProps, encoding: string = 'base64'): string => {
  return `data:${props.mime};${encoding},${props.buf.toString(encoding)}`
}

export const decodeDataURI = (input: string): DataURIProps => {
  const colon = input.indexOf(':')
  const semi = input.indexOf(';')
  const comma = input.indexOf(',')
  const mime = input.substring(colon + 1, semi)
  const encoding = input.substring(semi + 1, comma) as BufferEncoding
  const data = input.substring(comma + 1)
  const buf = Buffer.from(data, encoding)
  return { mime, buf }
}
