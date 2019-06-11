import { ISpec, standardizeDate } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Record } from './Record'
import { TransactionInput } from './TransactionInput'

@Entity({ name: 'transactions' })
export class Transaction extends Record<Transaction.Props> {
  @PrimaryColumn() id!: string
  @Column() accountId!: string

  @Column() time!: Date
  @Column() account!: string
  @Column() serverid!: string
  @Column() type!: string
  @Column() name!: string
  @Column() memo!: string
  @Column() amount!: number
  @Column({ default: 0 }) balance!: number
  // split: Split

  constructor(accountId?: string, id?: string, props?: TransactionInput) {
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

  // // TODO: move this to untility
  // type Nullable<T> = { [K in keyof T]?: T[K] | undefined | null }

  // export const diff = (tx: Transaction, values: Nullable<Props>): Query => {
  //   return Object.keys(values).reduce(
  //     (q, prop): Query => {
  //       const val = values[prop]
  //       if (val !== tx[prop]) {
  //         return ({
  //           ...q,
  //           [prop]: { $set: val }
  //         })
  //       } else {
  //         return q
  //       }
  //     },
  //     {} as Query
  //   )
  // }
}
