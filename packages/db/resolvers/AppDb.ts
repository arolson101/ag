import { fail } from 'assert'
import debug from 'debug'
import { Arg, Field, Mutation, ObjectType } from 'type-graphql'
import { Connection } from 'typeorm'
import { Account, Bank, DbChange, Record, Setting, Transaction } from '../entities'
import {
  AccountRepository,
  BankRepository,
  SettingsRepository,
  TransactionRepository,
} from '../repositories'

const log = debug('db:AppDb')

export interface Change {
  readonly seq?: number
  readonly text: string
}

@ObjectType()
export class AppDb {
  private connection?: Connection
  settingsRepository?: SettingsRepository
  banksRepository?: BankRepository
  accountsRepository?: AccountRepository
  transactionsRepository?: TransactionRepository

  @Field()
  loggedIn: boolean

  constructor() {
    this.loggedIn = false
  }

  open(connection: Connection) {
    log('open %o', connection)
    if (this.connection) {
      throw new Error('app db is already open')
    }
    this.loggedIn = true
    this.connection = connection
    this.settingsRepository = connection.getCustomRepository(SettingsRepository)
    this.banksRepository = connection.getCustomRepository(BankRepository)
    this.accountsRepository = connection.getCustomRepository(AccountRepository)
    this.transactionsRepository = connection.getCustomRepository(TransactionRepository)
  }

  async close() {
    log('close')
    if (this.connection) {
      await this.connection.close()
      this.loggedIn = false
      this.connection = undefined
      this.settingsRepository = undefined
      this.banksRepository = undefined
      this.accountsRepository = undefined
      this.transactionsRepository = undefined
    }
  }

  @Field(returns => Setting, { nullable: true })
  async get(
    @Arg('key') key: string //
  ): Promise<Setting | undefined> {
    // log('get %s', key)
    if (this.settingsRepository) {
      const setting = await this.settingsRepository.get(key)
      return setting
    }
  }

  @Mutation(returns => Setting, { nullable: true })
  async set(
    @Arg('key') key: string, //
    @Arg('value') value: string
  ): Promise<Setting | undefined> {
    log('set %s %s', key, value)
    if (this.settingsRepository) {
      const setting = await this.settingsRepository.set(key, value)
      return setting
    }
  }

  async bank(bankId: string): Promise<Bank>

  @Field(returns => Bank, { nullable: true })
  async bank(
    @Arg('bankId', { nullable: true }) bankId?: string //
  ): Promise<Bank | undefined> {
    const banks = this.banksRepository
    if (!banks) {
      throw new Error('app db is not open')
    }
    return bankId ? banks.getById(bankId) : undefined
  }

  @Field(returns => [Bank])
  async banks(): Promise<Bank[]> {
    const banks = this.banksRepository
    if (!banks) {
      throw new Error('app db is not open')
    }
    return banks.all()
  }

  async account(accountId: string): Promise<Account>

  @Field(returns => Account, { nullable: true })
  async account(
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Account | undefined> {
    const accounts = this.accountsRepository
    if (!accounts) {
      throw new Error('app db is not open')
    }
    return accountId ? accounts.getById(accountId) : undefined
  }

  @Field(returns => [Account])
  async accounts(): Promise<Account[]> {
    const accounts = this.accountsRepository
    if (!accounts) {
      throw new Error('app db is not open')
    }
    return accounts.all()
  }

  async transaction(transactionId: string): Promise<Transaction>

  @Field(returns => Transaction, { nullable: true })
  async transaction(
    @Arg('transactionId', { nullable: true }) transactionId?: string
  ): Promise<Transaction | undefined> {
    const transactions = this.transactionsRepository
    if (!transactions) {
      throw new Error('app db is not open')
    }
    return transactionId ? transactions.getById(transactionId) : undefined
  }

  async dbWrite(changes: DbChange[]) {
    log('dbWrite %o', changes)
    const db = this.connection
    if (!db) {
      throw new Error('app db is not open')
    }
    try {
      await db.transaction(async manager => {
        for (const change of changes) {
          if (change.adds) {
            await manager.save(change.table, change.adds)
          }

          if (change.deletes) {
            await manager
              .createQueryBuilder()
              .update(change.table)
              .set({ _deleted: change.t })
              .whereInIds(change.deletes)
              .execute()
          }

          if (change.edits) {
            const edits = change.edits
            const ids = change.edits.map(edit => edit.id)
            const items = await manager.findByIds<Record<any>>(change.table, ids)
            items.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
            items.forEach((record, i) => {
              // log('before %o %o', record, edits[i].q)
              record.update(change.t, edits[i].q)
            })
            await manager.save(change.table, items)
          }
        }

        // const text = JSON.stringify(changes)
        // await this._changes.add({ text })
      })
    } catch (err) {
      fail(err)
    }
  }
}
