import { defineMessages } from 'react-intl'
import { filter, ignoreElements, tap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreEpic } from './CoreEpic'

const deleteBankEpic: CoreEpic = (action$, state$, { ui }) =>
  action$.pipe(
    filter(isActionOf(actions.deleteBank)),
    withLatestFrom(state$),
    tap(([action, state]) => {
      const { bank, onComplete } = action.payload
      const { banksRepository } = selectors.getAppDb(state)
      const intl = selectors.getIntl(state)

      const { alert, showToast } = ui
      const intlCtx = { name: bank.name }

      alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.bankBody, intlCtx),
        danger: true,

        confirmText: intl.formatMessage(messages.delete),
        onConfirm: async () => {
          try {
            await banksRepository.deleteBank(bank.id)
            showToast(intl.formatMessage(messages.bankDeleted, intlCtx), true)
            onComplete()
          } catch (error) {
            ErrorDisplay.show(ui, intl, error)
          }
        },

        cancelText: intl.formatMessage(messages.cancel),
        onCancel: () => {},
      })
    }),
    ignoreElements()
  )

const deleteAccountEpic: CoreEpic = (action$, state$, { ui }) =>
  action$.pipe(
    filter(isActionOf(actions.deleteAccount)),
    withLatestFrom(state$),
    tap(([action, state]) => {
      const { account, onComplete } = action.payload
      const { accountsRepository } = selectors.getAppDb(state)
      const intl = selectors.getIntl(state)

      const { alert, showToast } = ui
      const intlCtx = { name: account.name }

      alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.accountBody, intlCtx),
        danger: true,

        confirmText: intl.formatMessage(messages.delete),
        onConfirm: async () => {
          try {
            await accountsRepository.deleteAccount(account.id)
            showToast(intl.formatMessage(messages.accountDeleted, intlCtx), true)
            onComplete()
          } catch (error) {
            ErrorDisplay.show(ui, intl, error)
          }
        },

        cancelText: intl.formatMessage(messages.cancel),
        onCancel: () => {},
      })
    }),
    ignoreElements()
  )

export const deleteEpics = [
  deleteBankEpic, //
  deleteAccountEpic,
]

const messages = defineMessages({
  title: {
    id: 'deleteEpics.title',
    defaultMessage: 'Are you sure?',
  },
  bankBody: {
    id: 'deleteEpics.body',
    defaultMessage: "This will delete the bank '{name}', all its accounts and their transactions",
  },
  accountBody: {
    id: 'deleteEpics.body',
    defaultMessage: "This will delete the account '{name}' and all its transactions",
  },
  delete: {
    id: 'deleteEpics.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'deleteEpics.cancel',
    defaultMessage: 'Cancel',
  },
  bankDeleted: {
    id: 'deleteEpics.deleted',
    defaultMessage: "Bank '{name}' deleted",
  },
  accountDeleted: {
    id: 'deleteEpics.deleted',
    defaultMessage: "Account '{name}' deleted",
  },
})
