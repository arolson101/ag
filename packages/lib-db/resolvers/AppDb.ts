import { Account, Bank, DbChange, Record, Transaction } from '@ag/lib-entities'
import { fail } from 'assert'
import debug from 'debug'
import { Arg, Field, ObjectType } from 'type-graphql'
import { Connection } from 'typeorm'
import { AccountRepository, BankRepository, TransactionRepository } from '../repositories'

const log = debug('db:AppDb')

export interface Change {
  readonly seq?: number
  readonly text: string
}

@ObjectType()
export class AppDb {
  private connection?: Connection
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
      this.banksRepository = undefined
      this.accountsRepository = undefined
      this.transactionsRepository = undefined
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
    return bankId ? banks.get(bankId) : undefined
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
    return accountId ? accounts.get(accountId) : undefined
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
    return transactionId ? transactions.get(transactionId) : undefined
  }

  async dbWrite(changes: DbChange[]) {
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
            const items = await manager.findByIds<Record<any>>(
              change.table,
              change.edits.map(edit => edit.id)
            )
            items.forEach((record, i) => {
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
