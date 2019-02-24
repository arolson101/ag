import { Account } from '@ag/lib-entities'
import { EntityRepository } from 'typeorm'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Account)
export class AccountRepository extends RecordRepository<Account> {
  async getForBank(bankId: string) {
    return this.createQueryBuilder('account')
      .where({ _deleted: 0, bankId })
      .getMany()
  }
}
