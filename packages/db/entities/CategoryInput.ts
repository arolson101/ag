import { Field, InputType } from 'type-graphql'

@InputType()
export class CategoryInput {
  @Field({ nullable: true }) name?: string
  @Field({ nullable: true }) amount?: number
}
