import { ImageId } from '@ag/core/context'
import { ImageUri, ISpec } from '@ag/util'
import debug from 'debug'
import * as R from 'ramda'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbChange } from './DbChange'
import { DbEntity, DbEntityKeys } from './DbEntity'

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
}

export namespace Bank {
  export interface Props extends Partial<Omit<Bank, DbEntityKeys>> {}
  export type Spec = ISpec<Props>

  export const iconSize = 128

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

  export const keys = R.keys(defaultValues)

  export namespace change {
    export const add = (t: number, bank: Bank): DbChange => ({
      table: 'bank',
      t,
      adds: [bank],
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: 'bank',
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: 'bank',
      t,
      deletes: [id],
    })
  }
}
