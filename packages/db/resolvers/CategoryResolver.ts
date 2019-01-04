import { Resolver } from 'type-graphql'
import { Category } from '../entities/Category'

@Resolver(objectType => Category)
export class CategoryResolver {}
