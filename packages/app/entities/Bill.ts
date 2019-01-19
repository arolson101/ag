import { ISpec } from '@ag/util/iupdate'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BillInput } from './BillInput'
import { Record } from './Record'

@ObjectType()
@Entity({ name: 'bills' })
export class Bill extends Record<Bill.Props> {
  @PrimaryColumn() @Field() id!: string
  @Column() @Field() name!: string
  @Column() @Field() group!: string
  @Column() @Field() web!: string
  @Column() @Field() favicon!: string
  @Column() @Field() notes!: string
  @Column() @Field() amount!: number
  @Column() @Field() account!: string
  @Column() @Field() category!: string
  @Column() @Field() rruleString!: string
  @Column() @Field() showAdvanced!: boolean
}

export namespace Bill {
  export interface Props extends Pick<BillInput, keyof BillInput> {}
  export type Spec = ISpec<Props>
}
