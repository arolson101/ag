import { EntityRepository } from 'typeorm'
import { Account } from '../../entities'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Account)
export class AccountRepository extends RecordRepository<Account> {
  async getForBank(bankId: string) {
    return this.createQueryBuilder('account')
      .where({ _deleted: 0, bankId })
      .getMany()
  }
}
