import { Account, DbChange, Transaction, TransactionInput } from '@ag/db/entities'
import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { dbWrite } from './dbWrite'

interface SaveTransactionsParams {
  transactions: Array<
    TransactionInput & {
      id?: string
    }
  >
  accountId: string
}

const saveTransactions = ({ transactions, accountId }: SaveTransactionsParams): CoreThunk =>
  async function _saveTransactions(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const { transactionRepository } = selectors.appDb(state)
      const t = Date.now()

      const txIds = transactions
        .map(tx => tx.id) //
        .filter((txId): txId is string => !!txId)

      const txs = await transactionRepository.getByIds(txIds)
      if (Object.keys(txIds).length !== txIds.length) {
        throw new Error('got back wrong number of transactions')
      }

      const accountDelta = transactions.reduce(
        (value, tx) =>
          value +
          (typeof tx.amount !== 'undefined' ? tx.amount - (tx.id ? txs[tx.id].amount : 0) : 0),
        0
      )

      const changes = transactions
        .map(
          ({ id, ...input }): DbChange => {
            if (id) {
              const transaction = txs[id]
              const q = diff<Transaction.Props>(transaction, input)
              return Transaction.change.edit(t, id, q)
            } else {
              const transaction = new Transaction(uniqueId(), accountId, input)
              return Transaction.change.add(t, [transaction])
            }
          }
        )
        .concat(Account.change.addTx(t, accountId, accountDelta))

      await dispatch(dbWrite(changes))
      showToast(intl.formatMessage(messages.saved, { count: transactions.length }))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const deleteTransaction = (transactionId: string): CoreThunk =>
  async function _deleteTransaction(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)
    const { transactionRepository } = selectors.appDb(state)

    try {
      const transaction = await transactionRepository.getById(transactionId)

      const confirmed = await alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.deleteTransactionBody),
        danger: true,

        confirmText: intl.formatMessage(messages.deleteTransactionConfirm),
        cancelText: intl.formatMessage(messages.cancel),
      })

      if (confirmed) {
        const t = Date.now()
        const changes: DbChange[] = [
          Transaction.change.remove(t, transactionId),
          ...Account.change.addTx(t, transaction.accountId, -transaction.amount),
        ]
        await dispatch(dbWrite(changes))
        showToast(intl.formatMessage(messages.transactionDeleted), true)
      }
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

export const transactionThunks = {
  saveTransactions,
  deleteTransaction,
}

const messages = defineMessages({
  title: {
    id: 'transactionThunks.title',
    defaultMessage: 'Are you sure?',
  },
  deleteTransactionBody: {
    id: 'transactionThunks.deleteTransactionBody',
    defaultMessage: 'This will delete the transaction',
  },
  deleteTransactionConfirm: {
    id: 'transactionThunks.deleteTransactionConfirm',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'transactionThunks.cancel',
    defaultMessage: 'Cancel',
  },
  transactionDeleted: {
    id: 'transactionThunks.transactionDeleted',
    defaultMessage: 'Transaction deleted',
  },
  saved: {
    id: 'transactionThunks.saved',
    defaultMessage: `{count} {count, plural,
      one {transaction}
      other {transactions}
    } saved`,
  },
})
