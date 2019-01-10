import { DocumentNode, execute, ExecutionArgs, ExecutionResult } from 'graphql'
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

const runQuery = async <Variables = ExecutionArgs['variableValues'], Result = object>(
  document: DocumentNode,
  variableValues: Variables
): Promise<ExecutionResult<Result>> => {
  return execute({
    schema,
    document,
    variableValues,
  })
}
