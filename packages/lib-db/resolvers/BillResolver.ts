import { Bill } from '@ag/lib-entities'
import { Resolver } from 'type-graphql'

@Resolver(objectType => Bill)
export class BillResolver {}
