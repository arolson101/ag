import { ISpec } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { DbEntity, DbEntityKeys } from './DbEntity'

@Entity({ name: 'categories' })
export class Category extends DbEntity<Category.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() amount!: number
}

export namespace Category {
  export interface Props extends Partial<Omit<Category, DbEntityKeys>> {}

  export type Query = ISpec<Props>
}
