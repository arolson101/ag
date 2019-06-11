import { DbChange, Transaction, TransactionInput } from '@ag/db/entities'
import { diff, uniqueId } from '@ag/util'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { dbWrite } from './dbWrite'

interface SaveTransactionParams {
  input: TransactionInput
  transactionId?: string
  accountId?: string
}

const saveTransaction = ({ input, transactionId, accountId }: SaveTransactionParams): CoreThunk =>
  async function _saveTransaction(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.getIntl(state)

    try {
      const { transactionsRepository } = selectors.getAppDb(state)
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
      await dispatch(dbWrite(changes))
      showToast(intl.formatMessage(transactionId ? messages.saved : messages.created))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const deleteTransaction = (transactionId: string): CoreThunk =>
  async function _deleteTransaction(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.getIntl(state)

    try {
      const confirmed = await alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.deleteTransactionBody),
        danger: true,

        confirmText: intl.formatMessage(messages.deleteTransactionConfirm),
        cancelText: intl.formatMessage(messages.cancel),
      })

      if (confirmed) {
        const t = Date.now()
        const table = Transaction
        const changes: DbChange[] = [{ table, t, deletes: [transactionId] }]
        await dispatch(dbWrite(changes))
        showToast(intl.formatMessage(messages.transactionDeleted), true)
      }
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

export const transactionThunks = {
  saveTransaction,
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
    defaultMessage: `Transaction saved`,
  },
  created: {
    id: 'transactionThunks.created',
    defaultMessage: `Transaction added`,
  },
})
