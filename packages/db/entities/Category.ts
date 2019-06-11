import { ISpec } from '@ag/util'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { CategoryInput } from './CategoryInput'
import { Record } from './Record'

@Entity({ name: 'categories' })
export class Category extends Record<Category.Props> {
  @PrimaryColumn() id!: string
  @Column() name!: string
  @Column() amount!: number
}

export namespace Category {
  export interface Props extends Pick<CategoryInput, keyof CategoryInput> {}

  export type Query = ISpec<Props>
}
