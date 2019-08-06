import { ISpec } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbEntity, DbEntityKeys } from './DbEntity'

@Entity({ name: 'budgets' })
export class Budget extends DbEntity<Budget.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() sortOrder!: number
}

export namespace Budget {
  export interface Props extends Partial<Omit<Budget, DbEntityKeys>> {}
  export type Spec = ISpec<Props>
}
