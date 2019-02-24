import { Category } from '@ag/lib-entities'
import { Resolver } from 'type-graphql'

@Resolver(objectType => Category)
export class CategoryResolver {}
