import { ImageSource } from '@ag/util'
import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import { ImageSourceScalar } from './customTypes'
import {
  AccountOnlineResolver,
  AccountResolver,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  DbResolver,
  TransactionResolver,
} from './resolvers'

ormUseContainer(Container)

export const schema = buildSchemaSync({
  resolvers: [
    DbResolver,
    BankResolver,
    AccountResolver,
    AccountOnlineResolver,
    BillResolver,
    TransactionResolver,
    BudgetResolver,
    CategoryResolver,
  ],
  container: Container,
  scalarsMap: [{ type: ImageSource, scalar: ImageSourceScalar }],
  validate: false, // https://github.com/19majkel94/type-graphql/issues/150
})
