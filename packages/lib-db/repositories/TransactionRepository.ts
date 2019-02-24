import { Transaction } from '@ag/lib-entities'
import { EntityRepository } from 'typeorm'
import { RecordRepository } from './RecordRepository'

@EntityRepository(Transaction)
export class TransactionRepository extends RecordRepository<Transaction> {
  async getForAccount(accountId: string, start?: Date, end?: Date) {
    let q = this.createQueryBuilder('tx').where({ _deleted: 0, accountId })

    if (start && end) {
      q = q.andWhere('tx.time BETWEEN :start AND :end', { start, end })
    }

    const res = await q.orderBy({ time: 'ASC' }).getMany()
    return res
  }
}
