import { EntityRepository } from 'typeorm'
import { Account } from '../entities'
import { dbWrite } from '../resolvers/dbWrite'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Account)
export class AccountRepository extends RecordRepository<Account> {
  async getForBank(bankId: string) {
    return this.createQueryBuilder('account')
      .where({ _deleted: 0, bankId })
      .orderBy({ sortOrder: 'ASC', name: 'ASC' })
      .getMany()
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    const t = Date.now()
    const changes = [Account.change.remove(t, accountId)]
    await dbWrite(this.manager.connection, changes)
    return true
  }
}
