// import { SchemaGenerator } from 'type-graphql/schema/schema-generator'
// import { BuildSchemaOptions } from 'type-graphql/utils/buildSchema'
import { buildSchemaSync } from 'type-graphql'
import { useContainer as gqlUseContainer } from 'type-graphql/utils/container'
import { Container } from 'typedi'
import {
  AccountResolver,
  BankResolver,
  BillResolver,
  BudgetResolver,
  CategoryResolver,
  DbResolver,
  TransactionResolver,
} from './resolvers'

// // build this function manually (copied from type-graphql) to fix runtime error:
// //   ./node_modules/type-graphql/helpers/loadResolversFromGlob.js
// //   10:46-63 Critical dependency: the request of a dependency is an expression
// export function buildSchemaSync(options: BuildSchemaOptions) {
//   return SchemaGenerator.generateFromMetadataSync(options)
// }

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
})
