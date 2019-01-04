import { Bill } from '../entities'
import { Resolver } from 'type-graphql'

@Resolver(objectType => Bill)
export class BillResolver {}
