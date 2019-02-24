import { formatDate, ISpec, standardizeDate } from '@ag/util'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Record } from './Record'
import { TransactionInput } from './TransactionInput'

@ObjectType()
@Entity({ name: 'transactions' })
export class Transaction extends Record<Transaction.Props> {
  @PrimaryColumn() @Field() id!: string
  @Column() @Field() accountId!: string

  @Column() @Field() time!: string
  @Column() @Field() account!: string
  @Column() @Field() serverid!: string
  @Column() @Field() type!: string
  @Column() @Field() name!: string
  @Column() @Field() memo!: string
  @Column() @Field() amount!: number
  @Column({ default: 0 }) @Field() balance!: number
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
    time: formatDate(standardizeDate(new Date())),
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
