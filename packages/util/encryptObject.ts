import assert from 'assert'
import crypto from 'crypto'
import msgpack from 'msgpack-lite/index.js'
import { pipe } from 'rxjs'
import zlib from 'zlib'

const magic = 'mpk1'
const MAX_HEADER_LEN = 1024
const DEV_TIMINGS = false

interface Spec {
  pbkdf2: {
    salt: Buffer
    keylen: number
    iterations: number
    digest: string
  }
  cipher: {
    algorithm: crypto.CipherGCMTypes
    iv: Buffer
    tag: Buffer
  }
}

const numberToBuffer = (n: number): Buffer => {
  const version = Buffer.allocUnsafe(4)
  version.writeInt32BE(n, 0)
  return version
}

const readNumberFromBuffer = (buf: Buffer, offset: number): number => {
  return buf.readInt32BE(offset)
}

export const encryptObject = <T extends {} = object>(object: T, password: string): Buffer => {
  const spec: Spec = {
    pbkdf2: {
      salt: crypto.randomBytes(16),
      keylen: 32,
      iterations: 1000,
      digest: 'sha512',
    },
    cipher: {
      algorithm: 'aes-256-gcm',
      iv: Buffer.alloc(16, 0),
      tag: Buffer.alloc(0),
    },
  }

  // console.time('crypto.pbkdf2Sync')
  const key = crypto.pbkdf2Sync(
    password,
    spec.pbkdf2.salt,
    spec.pbkdf2.iterations,
    spec.pbkdf2.keylen,
    spec.pbkdf2.digest
  )
  // console.timeEnd('crypto.pbkdf2Sync')

  const encrypt = (text: Buffer) => {
    // console.time('encrypt')
    const cipher = crypto.createCipheriv(spec.cipher.algorithm, key, spec.cipher.iv)
    const ret = Buffer.concat([
      cipher.update(text), //
      cipher.final(),
    ])
    spec.cipher.tag = cipher.getAuthTag()
    // console.timeEnd('encrypt')
    return ret
  }

  const encode = pipe(
    msgpack.encode, //
    zlib.deflateRawSync,
    encrypt
  )

  // console.time('encode')
  const encoded = encode(object)
  // console.timeEnd('encode')

  assert(spec.cipher.tag.length > 0)
  const header = msgpack.encode(spec)
  assert(header.length < MAX_HEADER_LEN)

  return Buffer.concat([
    Buffer.from(magic), //
    numberToBuffer(header.length),
    header,
    encoded,
  ])
}

export const decryptObject = <T extends {} = object>(password: string, data: Buffer): T => {
  const checkMagic = data.slice(0, magic.length).toString()
  if (checkMagic !== magic) {
    throw new Error(`invalid file header: '${checkMagic}' should be '${magic}'`)
  }

  const headerLenStart = magic.length
  const headerLen = readNumberFromBuffer(data, headerLenStart)
  if (headerLen <= 0 || MAX_HEADER_LEN <= headerLen) {
    throw new Error(`invalid file header: bad size ${headerLen}`)
  }

  const headerStart = headerLenStart + 4
  const headerBuf = data.slice(headerStart, headerStart + headerLen)
  const header: Spec = msgpack.decode(headerBuf)

  const dataStart = headerStart + headerLen
  const dataBuf = data.slice(dataStart)

  const key = crypto.pbkdf2Sync(
    password,
    header.pbkdf2.salt,
    header.pbkdf2.iterations,
    header.pbkdf2.keylen,
    header.pbkdf2.digest
  )

  const decrypt = (text: Buffer) => {
    // console.time('decrypt')
    const decipher = crypto.createDecipheriv(header.cipher.algorithm, key, header.cipher.iv)
    decipher.setAuthTag(header.cipher.tag)
    const ret = Buffer.concat([
      decipher.update(text), //
      decipher.final(),
    ])
    // console.timeEnd('decrypt')
    return ret
  }

  const decode = pipe(
    decrypt, //
    zlib.inflateRawSync,
    msgpack.decode
  )

  // console.time('decode')
  const t = decode(dataBuf) as T
  // console.timeEnd('decode')

  return t
}
