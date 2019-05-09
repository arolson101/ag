import { selectors } from '@ag/core'
import { diff, uniqueId } from '@ag/util'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { DbContext } from '../DbContext'
import { DbChange, Transaction, TransactionInput } from '../entities'
import { dbWrite } from './dbWrite'

@Resolver(objectType => Transaction)
export class TransactionResolver {
  @Query(returns => Transaction, { nullable: true })
  async transaction(
    @Ctx() { store }: DbContext, //
    @Arg('transactionId', { nullable: true }) transactionId?: string
  ): Promise<Transaction | undefined> {
    const { transactionsRepository } = selectors.getAppDb(store.getState())
    return transactionId ? transactionsRepository.getById(transactionId) : undefined
  }

  @Mutation(returns => Transaction)
  async saveTransaction(
    @Ctx() { store }: DbContext,
    @Arg('input') input: TransactionInput,
    @Arg('transactionId', { nullable: true }) transactionId: string,
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Transaction> {
    const state = store.getState()
    const { connection, transactionsRepository } = selectors.getAppDb(state)
    const t = Date.now()
    const table = Transaction
    let transaction: Transaction
    let changes: DbChange[]
    if (transactionId) {
      transaction = await transactionsRepository.getById(transactionId)
      const q = diff<Transaction.Props>(transaction, input)
      changes = [{ table, t, edits: [{ id: transactionId, q }] }]
      transaction.update(t, q)
    } else {
      if (!accountId) {
        throw new Error('when creating an transaction, accountId must be specified')
      }
      transaction = new Transaction(uniqueId(), accountId, input)
      transactionId = transaction.id
      changes = [{ table, t, adds: [transaction] }]
    }
    await dbWrite(connection, changes)
    return transaction
  }

  @Mutation(returns => Transaction)
  async deleteTransaction(
    @Ctx() { store }: DbContext,
    @Arg('transactionId') transactionId: string //
  ): Promise<Transaction> {
    const state = store.getState()
    const { connection, transactionsRepository } = selectors.getAppDb(state)
    const t = Date.now()
    const table = Transaction
    const transaction = await transactionsRepository.getById(transactionId)
    const changes: DbChange[] = [{ table, t, deletes: [transactionId] }]
    await dbWrite(connection, changes)
    return transaction
  }
}
