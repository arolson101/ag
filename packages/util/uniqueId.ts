import crypto from 'crypto'

export const uniqueId = () => {
  return (
    'a' +
    crypto //
      .randomBytes(16)
      .toString('hex')
  )
}
