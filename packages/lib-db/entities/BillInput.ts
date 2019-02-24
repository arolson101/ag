import { Field, InputType } from 'type-graphql'

@InputType()
export class BillInput {
  @Field({ nullable: true }) name?: string
  @Field({ nullable: true }) group?: string
  @Field({ nullable: true }) web?: string
  @Field({ nullable: true }) favicon?: string
  @Field({ nullable: true }) notes?: string
  @Field({ nullable: true }) amount?: number
  @Field({ nullable: true }) account?: string
  @Field({ nullable: true }) category?: string
  @Field({ nullable: true }) rruleString?: string
  @Field({ nullable: true }) showAdvanced?: boolean
}
