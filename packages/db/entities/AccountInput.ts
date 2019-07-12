import { ImageUri } from '@ag/util'
import { AccountType } from './AccountType'

export class AccountInput {
  name?: string
  color?: string
  type?: AccountType
  number?: string
  visible?: boolean
  routing?: string
  key?: string
  icon?: ImageUri
  sortOrder?: number
  currencyCode?: string
}
