import { DocumentNode, execute, ExecutionArgs } from 'graphql'
import { Container } from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import { schema } from './schema'
import { DbImports, DbImportsService } from './services'

ormUseContainer(Container)

export { DbImports }

export const initDb = (imports: DbImports) => {
  Container.set(DbImportsService, new DbImportsService(imports))
  return runQuery
}

const runQuery = async (
  document: DocumentNode,
  variableValues: ExecutionArgs['variableValues']
) => {
  return execute({
    schema,
    document,
    variableValues,
  })
}
