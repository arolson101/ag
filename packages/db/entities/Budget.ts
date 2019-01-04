import { ISpec } from '@ag/util/iupdate'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Record } from '../Record'
import { BudgetInput } from './BudgetInput'

@ObjectType()
@Entity({ name: 'budgets' })
export class Budget extends Record<Budget.Props> {
  @PrimaryColumn() @Field() id!: string
  @Column() @Field() name!: string
  @Column() @Field() sortOrder!: number
}

export namespace Budget {
  export interface Props extends Pick<BudgetInput, keyof BudgetInput> {}
  export type Spec = ISpec<Props>
}
