import { EntityRepository } from 'typeorm'
import { Transaction } from '../entities'
import { RecordRepository } from './RecordRepository'

export const equals = <K extends keyof Transaction>(alias: string, obj: Pick<Transaction, K>) => {
  const key = Object.keys(obj)[0]
  return [`${alias}.${key} = :${key}`, obj] as const
}

@EntityRepository(Transaction)
export class TransactionRepository extends RecordRepository<Transaction> {
  async getForAccount(accountId: string, start?: Date, end?: Date) {
    const alias = 'tx'
    let q = this.createQueryBuilder(alias)
      .where(...equals(alias, { _deleted: 0 }))
      .andWhere(...equals(alias, { accountId }))

    if (start && end) {
      q = q.andWhere('tx.time BETWEEN :start AND :end', { start, end })
    }

    console.time('tx query ' + accountId)
    const res = await q.getMany()
    console.timeEnd('tx query ' + accountId)
    return res
  }
}
