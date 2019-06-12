import { ISpec } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BudgetInput } from './BudgetInput'
import { DbEntity } from './DbEntity'

@Entity({ name: 'budgets' })
export class Budget extends DbEntity<Budget.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() sortOrder!: number
}

export namespace Budget {
  export interface Props extends Pick<BudgetInput, keyof BudgetInput> {}
  export type Spec = ISpec<Props>
}
