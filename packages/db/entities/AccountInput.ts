import { ImageUri } from '@ag/util'
import { Field, InputType } from 'type-graphql'
import { ImageUriScalar } from '../customTypes'
import { AccountType } from './AccountType'

@InputType()
export class AccountInput {
  @Field({ nullable: true }) name?: string
  @Field({ nullable: true }) color?: string
  @Field(type => AccountType, { nullable: true }) type?: AccountType
  @Field({ nullable: true }) number?: string
  @Field({ nullable: true }) visible?: boolean
  @Field({ nullable: true }) routing?: string
  @Field({ nullable: true }) key?: string
  @Field(type => ImageUriScalar, { nullable: true }) icon?: ImageUri
  @Field({ nullable: true }) sortOrder?: number
}
