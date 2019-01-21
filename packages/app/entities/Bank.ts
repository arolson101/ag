import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbChange } from '../resolvers/dbWrite'
import { ISpec } from '../util/iupdate'
import { BankInput } from './BankInput'
import { Record } from './Record'

@ObjectType()
@Entity({ name: 'banks' })
export class Bank extends Record<Bank.Props> {
  @PrimaryColumn() @Field() id!: string

  @Column() @Field() name!: string
  @Column() @Field() web!: string
  @Column() @Field() address!: string
  @Column() @Field() notes!: string
  @Column() @Field() favicon!: string // JSON stringified FavicoProps

  @Column() @Field() online!: boolean

  @Column() @Field() fid!: string
  @Column() @Field() org!: string
  @Column() @Field() ofx!: string

  @Column() @Field() username!: string
  @Column() @Field() password!: string

  constructor(id?: string, props?: BankInput) {
    super(id, { ...Bank.defaultValues, ...props })
  }
}

export namespace Bank {
  export interface Props extends Pick<BankInput, keyof BankInput> {}
  export type Spec = ISpec<Props>

  export namespace change {
    export const add = (t: number, bank: Bank): DbChange => ({
      table: Bank,
      t,
      adds: [bank],
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: Bank,
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: Bank,
      t,
      deletes: [id],
    })
  }

  export const defaultValues: Required<Props> = {
    name: '',
    web: '',
    address: '',
    notes: '',
    favicon: '',

    online: true,

    fid: '',
    org: '',
    ofx: '',

    username: '',
    password: '',
  }
}
