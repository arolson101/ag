import { Budget } from '@ag/lib-entities'
import { Resolver } from 'type-graphql'

@Resolver(objectType => Budget)
export class BudgetResolver {}
