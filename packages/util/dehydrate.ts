import { pipe } from 'rxjs'
import { deflateRawSync, inflateRawSync } from 'zlib'

export type CompressedJson<T extends {}> = '<compressed json>' & { _tag: T }

const CJSONToBuffer = (str: CompressedJson<any>) => Buffer.from(str, 'base64')
const bufferToCJSON = (buffer: Buffer) => buffer.toString('base64') as CompressedJson<any>
const bufferToString = (buffer: Buffer) => buffer.toString('utf8')
const stringToBuffer = (str: string) => Buffer.from(str, 'utf8')
const JSONserialize = (obj: object) => JSON.stringify(obj, null)
const JSONdeserialize = (str: string) => JSON.parse(str)

export const dehydrate: <T>(obj: T & object) => CompressedJson<T> = pipe(
  JSONserialize,
  stringToBuffer,
  deflateRawSync,
  bufferToCJSON
)

export const hydrate: <T>(x: CompressedJson<T>) => T = pipe(
  CJSONToBuffer,
  inflateRawSync,
  bufferToString,
  JSONdeserialize
)
