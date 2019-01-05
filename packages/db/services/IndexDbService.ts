import crypto from 'crypto'
import sanitize from 'sanitize-filename'
import { Service } from 'typedi'
import { Connection, Repository, Transaction } from 'typeorm'
import { Account, Bank, Bill, Budget, DbInfo } from '../entities'
import { AppDbService } from './AppDbService'
import { DbImportsService } from './DbImportsService'

const appEntities = [
  Account, //
  Bank,
  Bill,
  Budget,
  Transaction,
]

const indexEntities = [
  DbInfo, //
]

@Service()
export class IndexDbService {
  private indexDbConnection!: Connection
  private initPromise: Promise<void>
  private dbInfos!: Repository<DbInfo>

  constructor(
    private appService: AppDbService, //
    private imports: DbImportsService
  ) {
    this.initPromise = this.init()
  }

  private async init() {
    this.indexDbConnection = await this.imports.openDb('index', '', indexEntities)
    this.dbInfos = this.indexDbConnection.getRepository(DbInfo)
  }

  async allDbs(): Promise<DbInfo[]> {
    await this.initPromise
    const dbs = await this.dbInfos.find()
    return dbs
  }

  async createDb(name: string, password: string): Promise<boolean> {
    await this.initPromise
    const dbInfo = new DbInfo()
    dbInfo.dbId = crypto.randomBytes(8).toString('base64')
    dbInfo.name = name
    dbInfo.path = sanitize(name)
    const key = DbInfo.generateKey()
    dbInfo.setPassword(key, password)

    const db = await this.imports.openDb(dbInfo.path, key, appEntities)
    await this.dbInfos.save(dbInfo)
    this.appService.open(db)
    return true
  }

  async openDb(dbId: string, password: string): Promise<boolean> {
    await this.initPromise
    const dbInfo = await this.dbInfos.findOneOrFail(dbId)
    const key = dbInfo.getKey(password)
    const db = await this.imports.openDb(dbInfo.path, key, appEntities)
    this.appService.open(db)
    return true
  }

  async closeDb(): Promise<boolean> {
    await this.appService.close()
    return true
  }

  async deleteDb(dbId: string): Promise<void> {
    const dbInfo = await this.dbInfos.findOneOrFail(dbId)
    await this.imports.deleteDb(dbInfo.path)
    await this.dbInfos
      .createQueryBuilder()
      .delete()
      .from(DbInfo)
      .where('dbId = :dbId', { dbId })
      .execute()
  }
}
