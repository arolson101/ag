import { Resolver } from 'type-graphql'
import { Bill } from '../entities'

@Resolver(objectType => Bill)
export class BillResolver {}
