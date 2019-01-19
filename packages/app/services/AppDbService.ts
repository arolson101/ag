import { Service } from 'typedi'
import { Connection } from 'typeorm'
import { DbChange, dbWrite } from './dbWrite'
import { AccountRepository, BankRepository, TransactionRepository } from './repositories'

@Service()
export class AppDbService {
  private appDbConnection!: Connection
  banks!: BankRepository
  accounts!: AccountRepository
  transactions!: TransactionRepository

  open(appDbConnection: Connection) {
    this.appDbConnection = appDbConnection
    this.banks = appDbConnection.getCustomRepository(BankRepository)
    this.accounts = appDbConnection.getCustomRepository(AccountRepository)
    this.transactions = appDbConnection.getCustomRepository(TransactionRepository)
  }

  async close() {
    await this.appDbConnection.close()
    delete this.appDbConnection
    delete this.banks
    delete this.accounts
    delete this.transactions
  }

  async write(changes: DbChange[]) {
    await dbWrite(this.appDbConnection, changes)
  }
}
