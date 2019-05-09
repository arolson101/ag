import { ImageSource } from '@ag/util'
import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import { ImageSourceScalar } from './customTypes'
import {
  AccountOnlineResolver,
  AccountResolver,
  AppDb,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  TransactionResolver,
} from './resolvers'

ormUseContainer(Container)

export const schema = buildSchemaSync({
  resolvers: [
    AppDb,
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
