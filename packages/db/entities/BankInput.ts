import { ImageString } from '@ag/util'
import { Field, InputType } from 'type-graphql'
import { ImageStringScalar } from '../customTypes'

@InputType()
export class BankInput {
  @Field({ nullable: true }) name?: string
  @Field({ nullable: true }) web?: string
  @Field({ nullable: true }) address?: string
  @Field({ nullable: true }) notes?: string
  @Field(type => ImageStringScalar, { nullable: true }) icon?: ImageString

  @Field({ nullable: true }) online?: boolean

  @Field({ nullable: true }) fid?: string
  @Field({ nullable: true }) org?: string
  @Field({ nullable: true }) ofx?: string

  @Field({ nullable: true }) username?: string
  @Field({ nullable: true }) password?: string
}
