import cuid from 'cuid'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Container } from 'typedi'
import { AppContext } from '../context'
import { Transaction, TransactionInput } from '../entities'
import { selectors } from '../reducers'
import { diff } from '../util/diff'
import { DbChange, dbWrite } from './dbWrite'

@Resolver(objectType => Transaction)
export class TransactionResolver {
  @Mutation(returns => Transaction)
  async saveTransaction(
    @Ctx() { getState }: AppContext,
    @Arg('input') input: TransactionInput,
    @Arg('transactionId', { nullable: true }) transactionId: string,
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Transaction> {
    const app = selectors.getAppDbOrFail(getState())
    const t = Date.now()
    const table = Transaction
    let transaction: Transaction
    let changes: DbChange[]
    if (transactionId) {
      transaction = await app.transactions.get(transactionId)
      const q = diff(transaction, input)
      changes = [{ table, t, edits: [{ id: transactionId, q }] }]
      transaction.update(t, q)
    } else {
      if (!accountId) {
        throw new Error('when creating an transaction, accountId must be specified')
      }
      transaction = new Transaction(cuid(), accountId, input)
      transactionId = transaction.id
      changes = [{ table, t, adds: [transaction] }]
    }
    await dbWrite(app.connection, changes)
    return transaction
  }

  @Mutation(returns => Transaction)
  async deleteTransaction(
    @Ctx() { getState }: AppContext,
    @Arg('transactionId') transactionId: string
  ): Promise<Transaction> {
    const app = selectors.getAppDbOrFail(getState())
    const t = Date.now()
    const table = Transaction
    const transaction = await app.transactions.get(transactionId)
    const changes: DbChange[] = [{ table, t, deletes: [transactionId] }]
    await dbWrite(app.connection, changes)
    return transaction
  }
}
