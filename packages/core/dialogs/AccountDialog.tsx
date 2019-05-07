import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { useAction, useIntl, useUi } from '../context'
import { AccountForm } from '../forms'

interface Props {
  bankId?: string
  accountId?: string
  isOpen: boolean
}

export const AccountDialog = Object.assign(
  React.memo<Props>(function _AccountDialog({ bankId, accountId, isOpen }) {
    const intl = useIntl()
    const closeDlg = useAction(actions.closeDlg)
    const { Dialog } = useUi()
    const accountForm = useRef<AccountForm>(null)

    const save = useCallback(
      function _save() {
        if (accountForm.current) {
          accountForm.current.save()
        }
      },
      [accountForm.current]
    )

    const close = useCallback(
      function _close() {
        closeDlg('account')
      },
      [closeDlg]
    )

    return (
      <Dialog
        isOpen={isOpen}
        onClose={close}
        title={intl.formatMessage(accountId ? messages.titleEdit : messages.titleCreate)}
        primary={{
          title: intl.formatMessage(accountId ? messages.save : messages.create),
          onClick: save,
        }}
        secondary={{
          title: intl.formatMessage(messages.cancel), //
          onClick: close,
        }}
      >
        <AccountForm
          onClosed={close} //
          ref={accountForm}
          bankId={bankId}
          accountId={accountId}
        />
      </Dialog>
    )
  }),
  {
    displayName: 'AccountDialog',
  }
)

const messages = defineMessages({
  titleEdit: {
    id: 'AccountDialog.titleEdit',
    defaultMessage: 'Edit Account',
  },
  titleCreate: {
    id: 'AccountDialog.titleCreate',
    defaultMessage: 'Add Account',
  },
  save: {
    id: 'AccountDialog.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'AccountDialog.create',
    defaultMessage: 'Add',
  },
  cancel: {
    id: 'AccountDialog.cancel',
    defaultMessage: 'Cancel',
  },
})
