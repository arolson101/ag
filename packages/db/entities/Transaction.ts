import { ISpec, standardizeDate } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbChange } from './DbChange'
import { DbEntity } from './DbEntity'

export interface Split {
  [categoryId: string]: number
}

export class TransactionInput {
  time?: Date
  account?: string
  serverid?: string
  type?: string
  name?: string
  memo?: string
  amount?: number
  // split: Split
}

@Entity({ name: 'transactions' })
export class Transaction extends DbEntity<Transaction.Props> {
  @PrimaryColumn() id!: string
  @Column() accountId!: string

  @Column() time!: Date
  @Column() account!: string
  @Column() serverid!: string
  @Column() type!: string
  @Column() name!: string
  @Column() memo!: string
  @Column() amount!: number
  // split: Split

  constructor(id?: string, accountId?: string, props?: TransactionInput) {
    super(id, { ...Transaction.defaultValues(), ...props })
    if (accountId) {
      this.accountId = accountId
    }
  }
}

export namespace Transaction {
  export interface Props extends Pick<TransactionInput, keyof TransactionInput> {}
  export type Spec = ISpec<Props>

  export const defaultValues = () => ({
    account: '',
    serverid: '',
    time: standardizeDate(new Date()),
    type: '',
    name: '',
    memo: '',
    amount: 0,
  })

  export namespace change {
    export const add = (t: number, transactions: Transaction[]): DbChange => ({
      table: Transaction,
      t,
      adds: transactions,
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: Transaction,
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: Transaction,
      t,
      deletes: [id],
    })
  }
}
