import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import {
  AccountOnlineResolver,
  AccountResolver,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  TransactionResolver,
} from './resolvers'

ormUseContainer(Container)

export const schema = buildSchemaSync({
  resolvers: [
    BankResolver,
    AccountResolver,
    AccountOnlineResolver,
    BillResolver,
    TransactionResolver,
    BudgetResolver,
    CategoryResolver,
  ],
  container: Container,
  validate: false, // https://github.com/19majkel94/type-graphql/issues/150
})
