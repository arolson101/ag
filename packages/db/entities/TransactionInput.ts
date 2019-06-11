export interface Split {
  [categoryId: string]: number
}

export class TransactionInput {
  account?: string
  serverid?: string
  time?: Date
  type?: string
  name?: string
  memo?: string
  amount?: number
  // split: Split
}
