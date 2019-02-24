import { diff } from '@ag/util'
import cuid from 'cuid'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { DbChange, Transaction, TransactionInput } from '../entities'
import { AppDb } from './AppDb'

@Resolver(objectType => Transaction)
export class TransactionResolver {
  constructor(private appDb: AppDb) {}

  @Mutation(returns => Transaction)
  async saveTransaction(
    @Arg('input') input: TransactionInput,
    @Arg('transactionId', { nullable: true }) transactionId: string,
    @Arg('accountId', { nullable: true }) accountId?: string
  ): Promise<Transaction> {
    const app = this.appDb
    const t = Date.now()
    const table = Transaction
    let transaction: Transaction
    let changes: DbChange[]
    if (transactionId) {
      transaction = await app.transaction(transactionId)
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
    await app.dbWrite(changes)
    return transaction
  }

  @Mutation(returns => Transaction)
  async deleteTransaction(
    @Arg('transactionId') transactionId: string //
  ): Promise<Transaction> {
    const app = this.appDb
    const t = Date.now()
    const table = Transaction
    const transaction = await app.transaction(transactionId)
    const changes: DbChange[] = [{ table, t, deletes: [transactionId] }]
    await app.dbWrite(changes)
    return transaction
  }
}
