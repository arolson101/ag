import { Field, InputType } from 'type-graphql'

@InputType()
export class BudgetInput {
  @Field({ nullable: true }) name?: string
  @Field({ nullable: true }) sortOrder?: number
}
