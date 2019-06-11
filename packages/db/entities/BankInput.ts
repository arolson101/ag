import { ImageUri } from '@ag/util'

export class BankInput {
  name?: string
  web?: string
  address?: string
  notes?: string
  icon?: ImageUri

  online?: boolean

  fid?: string
  org?: string
  ofx?: string

  username?: string
  password?: string
}
