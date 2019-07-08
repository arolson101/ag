import { ISpec } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BillInput } from './BillInput'
import { DbEntity } from './DbEntity'

@Entity({ name: 'bills' })
export class Bill extends DbEntity<Bill.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() group!: string
  @Column() web!: string
  @Column() favicon!: string
  @Column() notes!: string
  @Column() amount!: number
  @Column() account!: string
  @Column() category!: string
  @Column() rruleString!: string
  @Column() showAdvanced!: boolean
}

export namespace Bill {
  export interface Props extends Pick<BillInput, keyof BillInput> {}
  export type Spec = ISpec<Props>
  export const iconSize = 128
}
