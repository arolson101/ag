import { ImageId } from '@ag/core/context'
import { ISpec } from '@ag/util'
import debug from 'debug'
import * as R from 'ramda'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbChange } from './DbChange'
import { DbEntity, DbEntityKeys } from './DbEntity'

const log = debug('db:Bill')

@Entity({ name: 'bills' })
export class Bill extends DbEntity<Bill.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() group!: string
  @Column() web!: string
  @Column('text', { nullable: true }) iconId!: ImageId
  @Column() notes!: string
  @Column() amount!: number
  @Column() account!: string
  @Column() category!: string
  @Column() showAdvanced!: boolean
  @Column({ nullable: true }) sortOrder!: number
  @Column() rruleString!: string
}

export namespace Bill {
  export interface Props extends Omit<Bill, DbEntityKeys> {}
  export type Spec = ISpec<Props>
  export const iconSize = 32

  export const defaultValues = {
    name: '',
    group: '',
    web: '',
    iconId: '' as ImageId,
    notes: '',
    amount: 0,
    account: '',
    category: '',
    showAdvanced: false,
    sortOrder: -1,
  }

  export const keys = R.keys(defaultValues)

  export namespace change {
    export const add = (t: number, bill: Bill): DbChange => ({
      table: 'bill',
      t,
      adds: [bill],
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: 'bill',
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: 'bill',
      t,
      deletes: [id],
    })
  }
}
