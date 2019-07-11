import { ImageUri, ISpec } from '@ag/util'
import debug from 'debug'
import { RRule } from 'rrule'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BillInput } from './BillInput'
import { DbChange } from './DbChange'
import { DbEntity } from './DbEntity'

const log = debug('db:Bill')

@Entity({ name: 'bills' })
export class Bill extends DbEntity<Bill.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() group!: string
  @Column() web!: string
  @Column('text') icon!: ImageUri
  @Column() notes!: string
  @Column() amount!: number
  @Column() account!: string
  @Column() category!: string
  @Column() showAdvanced!: boolean
  @Column({ nullable: true }) sortOrder!: number
  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      from: (value: string) => {
        // log('from %s', value)
        return RRule.fromString(value)
      },
      to: (value: RRule) => {
        // log('to: %o', value)
        return value.toString()
      },
    },
  })
  rrule!: RRule
}

export namespace Bill {
  export interface Props extends Pick<BillInput, keyof BillInput> {}
  export type Spec = ISpec<Props>
  export const iconSize = 128

  export const defaultValues: Required<Props> = {
    name: '',
    group: '',
    web: '',
    icon: '',
    notes: '',
    amount: 0,
    account: '',
    category: '',
    rrule: new RRule(),
    showAdvanced: false,
    sortOrder: -1,
  }

  export namespace change {
    export const add = (t: number, bill: Bill): DbChange => ({
      table: Bill,
      t,
      adds: [bill],
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: Bill,
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: Bill,
      t,
      deletes: [id],
    })
  }
}
