import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { DbContext } from '../DbContext'
import { Transaction } from '../entities'

@Resolver(objectType => Transaction)
export class TransactionResolver {
  @Query(returns => Transaction, { nullable: true })
  async transaction(
    @Ctx() { getAppDb }: DbContext, //
    @Arg('transactionId', { nullable: true }) transactionId?: string
  ): Promise<Transaction | undefined> {
    const { transactionsRepository } = getAppDb()
    return transactionId ? transactionsRepository.getById(transactionId) : undefined
  }
}
