import { ImageId } from '@ag/core/context'
import { ImageUri, ISpec } from '@ag/util'
import debug from 'debug'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BankInput } from './BankInput'
import { DbChange } from './DbChange'
import { DbEntity } from './DbEntity'

const log = debug('db:Bank')

@Entity({ name: 'banks' })
export class Bank extends DbEntity<Bank.Props> {
  @PrimaryColumn() id!: string

  @Column() name!: string
  @Column() web!: string
  @Column() address!: string
  @Column() notes!: string
  @Column('text') iconId!: ImageId

  @Column() online!: boolean

  @Column() fid!: string
  @Column() org!: string
  @Column() ofx!: string

  @Column() username!: string
  @Column() password!: string

  constructor(id?: string, props?: BankInput) {
    super(id, { ...Bank.defaultValues, ...props })
    // log('Bank constructor %o', this)
  }
}

export namespace Bank {
  export interface Props extends Pick<BankInput, keyof BankInput> {}
  export type Spec = ISpec<Props>

  export const iconSize = 128

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
    iconId: '',

    online: true,

    fid: '',
    org: '',
    ofx: '',

    username: '',
    password: '',
  }
}
