import { Account } from './Account'
import { Bank } from './Bank'
import { Bill } from './Bill'
import { Budget } from './Budget'
import { Category } from './Category'
import { Image } from './Image'
import { Setting } from './Setting'
import { Transaction } from './Transaction'

export const appTable = {
  account: Account,
  bank: Bank,
  bill: Bill,
  budget: Budget,
  category: Category,
  image: Image,
  transaction: Transaction,
  setting: Setting,
}

export const appEntities = Object.values(appTable)
export type AppTable = keyof typeof appTable
