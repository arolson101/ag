import { ISpec } from '@ag/util/iupdate'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Record } from '../Record'
import { CategoryInput } from './CategoryInput'

@ObjectType()
@Entity({ name: 'categories' })
export class Category extends Record<Category.Props> {
  @PrimaryColumn() @Field() id!: string
  @Column() @Field() name!: string
  @Column() @Field() amount!: number
}

export namespace Category {
  export interface Props extends Pick<CategoryInput, keyof CategoryInput> {}

  export type Query = ISpec<Props>
}
