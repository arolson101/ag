import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'settings' })
export class Setting {
  @PrimaryColumn() @Field() key!: string
  @Column() @Field() value!: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }
}
