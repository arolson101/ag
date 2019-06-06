import assert from 'assert'
import crypto from 'crypto'
import msgpack from 'msgpack-lite'
import stream, { Readable, Writable } from 'stream'
import promisify from 'util.promisify'
import zlib from 'zlib'

const finished = promisify(stream.finished)

const magic = 'mpk1'
const MAX_HEADER_LEN = 1024 * 1024

interface Spec {
  pbkdf2: {
    salt: Buffer
    keylen: number
    iterations: number
    digest: string
  }
  cipher: {
    algorithm: string
    iv: Buffer
  }
}

async function readable(rs: Readable): Promise<{}> {
  return new Promise(r => rs.once('readable', r))
}

async function readBytes(rs: Readable, num: number = 0): Promise<Buffer> {
  const buf = rs.read(num)
  if (buf) {
    return new Promise<Buffer>(r => r(buf))
  } else {
    return new Promise<Buffer>(r => {
      readable(rs).then(() => {
        readBytes(rs, num).then(b => r(b))
      })
    })
  }
}

export const writeObjectsToStream = async (objects: object[], password: string, ws: Writable) => {
  const spec: Spec = {
    pbkdf2: {
      salt: crypto.randomBytes(16),
      keylen: 32,
      iterations: 100000,
      digest: 'sha512',
    },
    cipher: {
      algorithm: 'aes-256-cbc',
      iv: Buffer.alloc(16, 0),
    },
  }

  const header = msgpack.encode(spec)
  assert(header.length < MAX_HEADER_LEN)

  ws.write(magic)

  const x = Buffer.allocUnsafe(4)
  x.writeInt32BE(header.length, 0)

  ws.write(x)
  ws.write(header)

  const key = crypto.pbkdf2Sync(
    password,
    spec.pbkdf2.salt,
    spec.pbkdf2.iterations,
    spec.pbkdf2.keylen,
    spec.pbkdf2.digest
  )

  const pack = msgpack.createEncodeStream()
  const p = pack
    .pipe(zlib.createDeflate())
    .pipe(crypto.createCipheriv(spec.cipher.algorithm, key, spec.cipher.iv))
    .pipe(ws)

  for (const obj of objects) {
    pack.write(obj)
  }
  pack.end()

  await finished(p)
}

export const readObjectsFromStream = async <T = object>(
  password: string,
  rs: Readable
): Promise<T[]> => {
  const checkMagic = (await readBytes(rs, magic.length)).toString()
  if (checkMagic !== magic) {
    throw new Error(`invalid file header: '${checkMagic}' should be '${magic}'`)
  }

  const headerLen = (await readBytes(rs, 4)).readInt32BE(0)
  if (headerLen <= 0 || MAX_HEADER_LEN <= headerLen) {
    throw new Error(`invalid file header: bad size ${headerLen}`)
  }

  const headerBuf = await readBytes(rs, headerLen)
  const header = msgpack.decode(headerBuf) as Spec

  const key = crypto.pbkdf2Sync(
    password,
    header.pbkdf2.salt,
    header.pbkdf2.iterations,
    header.pbkdf2.keylen,
    header.pbkdf2.digest
  )

  const objects: T[] = []

  const unpack = rs
    .pipe(crypto.createDecipheriv(header.cipher.algorithm, key, header.cipher.iv))
    .pipe(zlib.createInflate())
    .pipe(msgpack.createDecodeStream())
    .on('data', obj => {
      objects.push(obj)
    })

  await finished(unpack)

  return objects
}
