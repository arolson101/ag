import { buildSchemaSync, useContainer as gqlUseContainer } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import {
  AccountResolver,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  DbResolver,
  TransactionResolver,
} from '../resolvers'
import { ImageSource } from '../util'
import { ImageSourceScalar } from './customTypes'

gqlUseContainer(Container)
ormUseContainer(Container)

export const schema = buildSchemaSync({
  resolvers: [
    DbResolver,
    BankResolver,
    AccountResolver,
    BillResolver,
    TransactionResolver,
    BudgetResolver,
    CategoryResolver,
  ],
  scalarsMap: [{ type: ImageSource, scalar: ImageSourceScalar }],
  validate: false, // https://github.com/19majkel94/type-graphql/issues/150
})
