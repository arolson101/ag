import { buildSchemaSync, useContainer as gqlUseContainer } from 'type-graphql'
import { Container } from 'typedi'
import {
  AccountResolver,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  DbResolver,
  TransactionResolver,
} from '../resolvers'

gqlUseContainer(Container)

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
  validate: false, // https://github.com/19majkel94/type-graphql/issues/150
})
