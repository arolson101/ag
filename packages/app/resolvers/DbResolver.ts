import crypto from 'crypto'
import debug from 'debug'
import sanitize from 'sanitize-filename'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { actions } from '../actions'
import { AppContext } from '../context'
import { Account, Bank, Bill, Budget, Category, Db, Transaction } from '../entities'
import { selectors } from '../reducers'
import { AppDb } from './AppDb'

const log = debug('app:DbResolver')
log.enabled = false // process.env.NODE_ENV !== 'production'

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
  private appDbInstance = new AppDb()
  private initPromise!: Promise<any>

  async init(ctx: AppContext) {
    if (this.initPromise === undefined) {
      this.initPromise = this.getDbs(ctx)
    }
    return this.initPromise
  }

  async getDbs(ctx: AppContext) {
    const { getState, openDb, dispatch } = ctx
    let dbs = selectors.getDbs(getState())
    if (!dbs) {
      const db = await openDb('index', '', indexEntities)
      dispatch(actions.openIndex(db))
      dbs = selectors.getDbs(getState())
      if (!dbs) {
        throw new Error('error initializing index db')
      }
    }
    return dbs
  }

  @Query(returns => [Db])
  async dbs(@Ctx() ctx: AppContext): Promise<Db[]> {
    log('dbs query')
    await this.init(ctx)
    const dbs = await this.getDbs(ctx)
    const all = await dbs.find()
    return all
  }

  @Query(returns => AppDb, { nullable: true })
  async appDb(@Ctx() ctx: AppContext): Promise<AppDb | undefined> {
    log('appDb')
    await this.init(ctx)
    const { getState } = ctx
    const appDb = selectors.getAppDb(getState())
    if (appDb) {
      return this.appDbInstance
    } else {
      return undefined
    }
  }

  @Mutation(returns => Boolean)
  async createDb(
    @Arg('name') name: string,
    @Arg('password', { description: 'the password for the database' }) password: string,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    log('createDb')
    const { openDb, dispatch } = ctx
    const dbInfo = new Db()
    dbInfo.dbId = crypto.randomBytes(8).toString('base64')
    dbInfo.name = name
    dbInfo.path = sanitize(name)
    const key = Db.generateKey()
    dbInfo.setPassword(key, password)

    const db = await openDb(dbInfo.path, key, appEntities)

    const dbs = await this.getDbs(ctx)
    await dbs.save(dbInfo)

    dispatch(actions.openApp(db))
    return true
  }

  @Mutation(returns => Boolean)
  async openDb(
    @Arg('dbId') dbId: string,
    @Arg('password', { description: 'the password for the database' }) password: string,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    log('openDb')
    const { openDb, dispatch } = ctx
    const dbs = await this.getDbs(ctx)
    const dbInfo = await dbs.findOneOrFail(dbId)
    const key = dbInfo.getKey(password)

    const db = await openDb(dbInfo.path, key, appEntities)

    dispatch(actions.openApp(db))
    return true
  }

  @Mutation(returns => Boolean)
  async closeDb(
    @Ctx() { dispatch }: AppContext //
  ): Promise<boolean> {
    log('closeDb')
    dispatch(actions.closeApp())
    return true
  }

  @Mutation(returns => String)
  async deleteDb(
    @Arg('dbId') dbId: string, //
    @Ctx() ctx: AppContext
  ): Promise<string> {
    log('deleteDb')
    const { deleteDb, dispatch } = ctx
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
