import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { DbInfo } from '../entities'
import { IndexDbService } from '../services'

export const indexEntities = [DbInfo]

@Service()
@Resolver(objectType => DbInfo)
export class DbResolver {
  constructor(private index: IndexDbService) {}

  @Query(returns => [DbInfo])
  async allDbs(): Promise<DbInfo[]> {
    return this.index.allDbs()
  }

  @Mutation(returns => Boolean)
  async createDb(
    @Arg('name') name: string,
    @Arg('password', { description: 'the password for the database' }) password: string
  ): Promise<boolean> {
    return this.index.createDb(name, password)
  }

  @Mutation(returns => Boolean)
  async openDb(
    @Arg('dbId') dbId: string,
    @Arg('password', { description: 'the password for the database' }) password: string
  ): Promise<boolean> {
    return this.index.openDb(dbId, password)
  }

  @Mutation(returns => Boolean)
  async closeDb(): Promise<boolean> {
    return this.index.closeDb()
  }

  @Mutation(returns => String)
  async deleteDb(@Arg('dbId') dbId: string): Promise<string> {
    return this.index.deleteDb(dbId)
  }
}
