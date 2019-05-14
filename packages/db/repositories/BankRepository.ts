import { EntityRepository } from 'typeorm'
import { Bank } from '../entities'
import { dbWrite } from '../resolvers/dbWrite'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Bank)
export class BankRepository extends RecordRepository<Bank> {
  async deleteBank(bankId: string): Promise<boolean> {
    const t = Date.now()
    const changes = [Bank.change.remove(t, bankId)]
    await dbWrite(this.manager.connection, changes)
    return true
  }
}
