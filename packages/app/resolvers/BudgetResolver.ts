import { Resolver } from 'type-graphql'
import { Budget } from '../entities'

@Resolver(objectType => Budget)
export class BudgetResolver {}
