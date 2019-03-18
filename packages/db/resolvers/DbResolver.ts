import crypto from 'crypto'
import debug from 'debug'
import sanitize from 'sanitize-filename'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { DbContext } from '../DbContext'
import { Account, Bank, Bill, Budget, Category, Db, Transaction } from '../entities'
import { AppDb } from './AppDb'
import { IndexDb } from './IndexDb'

const log = debug('db:DbResolver')

const indexEntities = [
  Db, //
]

const appEntities = [
  Account, //
  Bank,
  Bill,
  Budget,
  Category,
  Transaction,
]

@Service()
@Resolver(objectType => Db)
export class DbResolver {
  private indexDb?: IndexDb

  constructor(private appDb: AppDb) {}

  @Query(returns => AppDb, { name: 'appDb', nullable: true })
  async appDbQuery(): Promise<AppDb | undefined> {
    return this.appDb.loggedIn ? this.appDb : undefined
  }

  async getDbs(ctx: DbContext) {
    const { openDb } = ctx
    if (!this.indexDb) {
      const db = await openDb('index', '', indexEntities)
      this.indexDb = new IndexDb(db)
    }
    return this.indexDb.dbRepository
  }

  @Query(returns => [Db])
  async dbs(@Ctx() ctx: DbContext): Promise<Db[]> {
    // log('dbs query')
    const dbs = await this.getDbs(ctx)
    const all = await dbs.find()
    return all
  }

  @Mutation(returns => Boolean)
  async createDb(
    @Arg('name') name: string,
    @Arg('password', { description: 'the password for the database' }) password: string,
    @Ctx() ctx: DbContext
  ): Promise<boolean> {
    // log('createDb')
    const { openDb } = ctx
    const dbInfo = new Db()
    dbInfo.dbId = crypto.randomBytes(8).toString('base64')
    dbInfo.name = name
    dbInfo.path = sanitize(name)
    const key = Db.generateKey()
    dbInfo.setPassword(key, password)

    const db = await openDb(dbInfo.path, key, appEntities)

    const dbs = await this.getDbs(ctx)
    await dbs.save(dbInfo)

    this.appDb.open(db)
    return true
  }

  @Mutation(returns => Boolean)
  async openDb(
    @Arg('dbId') dbId: string,
    @Arg('password', { description: 'the password for the database' }) password: string,
    @Ctx() ctx: DbContext
  ): Promise<boolean> {
    // log('openDb')
    const { openDb } = ctx
    const dbs = await this.getDbs(ctx)
    const dbInfo = await dbs.findOneOrFail(dbId)
    const key = dbInfo.getKey(password)

    const db = await openDb(dbInfo.path, key, appEntities)

    this.appDb.open(db)
    return true
  }

  @Mutation(returns => Boolean)
  async closeDb(): Promise<boolean> {
    // log('closeDb')
    await this.appDb.close()
    return true
  }

  @Mutation(returns => String)
  async deleteDb(
    @Arg('dbId') dbId: string, //
    @Ctx() ctx: DbContext
  ): Promise<string> {
    // log('deleteDb')
    const { deleteDb } = ctx
    const dbs = await this.getDbs(ctx)
    const dbInfo = await dbs.findOneOrFail(dbId)
    await deleteDb(dbInfo.path)
    await dbs
      .createQueryBuilder()
      .delete()
      .from(Db)
      .where('dbId = :dbId', { dbId })
      .execute()
    return dbId
  }
}
