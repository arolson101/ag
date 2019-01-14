import { ApolloServer } from 'apollo-server'
import debug from 'debug'
import getPort from 'get-port'
import Container from 'typedi'
import { useContainer as ormUseContainer } from 'typeorm'
import { DbImports } from './initDb'
import { schema } from './schema'
import { DbImportsService } from './services'
// import { GraphQLRequest } from 'apollo-server-plugin-base';

const log = debug('app:server')

debug.enable('app:*')

ormUseContainer(Container)

export const startServer = async (imports: DbImports) => {
  Container.set(DbImportsService, new DbImportsService(imports))

  const port = await getPort({ port: 4000 })
  const host = '127.0.0.1'

  const server = new ApolloServer({
    schema,
  })

  // const request: GraphQLRequest = {}
  // server.executeOperation(request)

  const ret = await server.listen({
    port,
    host,
  })

  log(`server started at ${ret.url}`)

  return ret
}
