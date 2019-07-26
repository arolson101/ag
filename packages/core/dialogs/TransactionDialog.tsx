import debug from 'debug'
import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { useAction, useIntl, useUi } from '../context'
import { TransactionForm } from '../forms'

const log = debug('core:TransactionDialog')

export interface TransactionDialogProps {
  accountId: string
  transactionId?: string
  isOpen: boolean
}

export const TransactionDialog = Object.assign(
  React.memo<TransactionDialogProps>(function _TransactionDialog({
    accountId,
    transactionId,
    isOpen,
  }) {
    const intl = useIntl()
    const closeDlg = useAction(actions.closeDlg)
    const { Dialog } = useUi()

    const transactionForm = useRef<TransactionForm>(null)

    const save = useCallback(
      function _save() {
        if (transactionForm.current) {
          transactionForm.current.save()
        }
      },
      [transactionForm.current]
    )

    const close = useCallback(
      function _close() {
        closeDlg('transaction')
      },
      [closeDlg]
    )

    return (
      <Dialog
        isOpen={isOpen}
        onClose={close}
        title={intl.formatMessage(transactionId ? messages.titleEdit : messages.titleCreate)}
        primary={{
          title: intl.formatMessage(transactionId ? messages.save : messages.create),
          onClick: save,
        }}
        secondary={{
          title: intl.formatMessage(messages.cancel),
          onClick: close,
        }}
      >
        <TransactionForm
          onClosed={close}
          ref={transactionForm}
          accountId={accountId}
          transactionId={transactionId}
        />
      </Dialog>
    )
  }),
  {
    name: 'TransactionDialog',
    displayName: 'TransactionDialog',
  }
)

const messages = defineMessages({
  titleEdit: {
    id: 'TransactionDialog.titleEdit',
    defaultMessage: 'Edit Transaction',
  },
  titleCreate: {
    id: 'TransactionDialog.titleCreate',
    defaultMessage: 'Add Transaction',
  },
  save: {
    id: 'TransactionDialog.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'TransactionDialog.create',
    defaultMessage: 'Add',
  },
  cancel: {
    id: 'TransactionDialog.cancel',
    defaultMessage: 'Cancel',
  },
})
