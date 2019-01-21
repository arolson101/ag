import crypto from 'crypto'
import debug from 'debug'
import sanitize from 'sanitize-filename'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Connection, getConnectionManager, Repository } from 'typeorm'
import { AppContext } from '../context'
import { Account, Bank, Bill, Budget, Category, Db, Transaction } from '../entities'
import { AppDbService } from '../services'
import { DbChange, dbWrite } from '../services/dbWrite'
import { AccountRepository, BankRepository, TransactionRepository } from '../services/repositories'

const log = debug('app:DbResolver')

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
  private initPromise?: Promise<void>
  private indexDbConnection!: Connection
  private dbRepository!: Repository<Db>

  constructor(private app: AppDbService) {}

  private init(ctx: AppContext) {
    if (this.initPromise) {
      return this.initPromise
    }
    this.initPromise = this.openIndexDb(ctx)
    return this.initPromise
  }

  private async openIndexDb({ openDb }: AppContext) {
    this.indexDbConnection = await openDb('index', '', indexEntities)
    this.dbRepository = this.indexDbConnection.getRepository(Db)
  }

  private async ensureClosed(name: string): Promise<void> {
    const mgr = getConnectionManager()
    if (mgr.has(name)) {
      await mgr.get(name).close()
    }
  }

  @Query(returns => [Db])
  async dbs(@Ctx() ctx: AppContext): Promise<Db[]> {
    log('dbs query')
    await this.init(ctx)
    const dbs = await this.dbRepository.find()
    return dbs
  }

  @Mutation(returns => Boolean)
  async createDb(
    @Arg('name') name: string,
    @Arg('password', { description: 'the password for the database' }) password: string,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    log('createDb')
    await this.init(ctx)
    const dbInfo = new Db()
    dbInfo.dbId = crypto.randomBytes(8).toString('base64')
    dbInfo.name = name
    dbInfo.path = sanitize(name)
    const key = Db.generateKey()
    dbInfo.setPassword(key, password)
    await this.ensureClosed(dbInfo.path)
    const db = await ctx.openDb(dbInfo.path, key, appEntities)
    await this.dbRepository.save(dbInfo)
    this.app.open(db)
    return true
  }

  @Mutation(returns => Boolean)
  async openDb(
    @Arg('dbId') dbId: string,
    @Arg('password', { description: 'the password for the database' }) password: string,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    log('openDb')
    await this.init(ctx)
    const dbInfo = await this.dbRepository.findOneOrFail(dbId)
    await this.ensureClosed(dbInfo.path)
    const key = dbInfo.getKey(password)
    const db = await ctx.openDb(dbInfo.path, key, appEntities)
    this.app.open(db)
    return true
  }

  @Mutation(returns => Boolean)
  async closeDb(): Promise<boolean> {
    log('closeDb')
    await this.close()
    return true
  }

  async close() {
    await this.app.close()
  }

  @Mutation(returns => String)
  async deleteDb(@Arg('dbId') dbId: string, @Ctx() ctx: AppContext): Promise<string> {
    log('deleteDb')
    const dbInfo = await this.dbRepository.findOneOrFail(dbId)
    await ctx.deleteDb(dbInfo.path)
    await this.dbRepository
      .createQueryBuilder()
      .delete()
      .from(Db)
      .where('dbId = :dbId', { dbId })
      .execute()
    return dbId
  }
}
