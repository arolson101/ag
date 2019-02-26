import { ImageSource } from '@ag/util'
import { buildSchemaSync, useContainer as gqlUseContainer } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import { ImageSourceScalar } from './customTypes'
import {
  AccountResolver,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  DbResolver,
  ImageResolver,
  OnlineResolver,
  TransactionResolver,
} from './resolvers'

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
    ImageResolver,
    OnlineResolver,
  ],
  scalarsMap: [{ type: ImageSource, scalar: ImageSourceScalar }],
  validate: false, // https://github.com/19majkel94/type-graphql/issues/150
})
