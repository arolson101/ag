import { Resolver } from 'type-graphql'
import { Category } from '../entities'

@Resolver(objectType => Category)
export class CategoryResolver {}
