import { ISpec, standardizeDate } from '@ag/util'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'
import { DbChange } from './DbChange'
import { DbEntity, DbEntityKeys } from './DbEntity'

export interface Split {
  [categoryId: string]: number
}

@Entity({ name: 'transactions' })
@Index(['time'])
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
}

export namespace Transaction {
  export interface Props extends Omit<Transaction, DbEntityKeys> {}
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
      table: 'transaction',
      t,
      adds: transactions,
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: 'transaction',
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: 'transaction',
      t,
      deletes: [id],
    })
  }
}
