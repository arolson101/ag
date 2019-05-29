import debug from 'debug'
import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { useAction, useIntl, useUi } from '../context'
import { BankForm } from '../forms'

const log = debug('core:BankDialog')

export interface BankDialogProps {
  bankId?: string
  isOpen: boolean
}

export const BankDialog = Object.assign(
  React.memo<BankDialogProps>(function _BankDialog({ bankId, isOpen }) {
    const intl = useIntl()
    const closeDlg = useAction(actions.closeDlg)
    const { Dialog } = useUi()

    const bankForm = useRef<BankForm>(null)

    const save = useCallback(
      function _save() {
        if (bankForm.current) {
          bankForm.current.save()
        }
      },
      [bankForm.current]
    )

    const close = useCallback(
      function _close() {
        closeDlg('bank')
      },
      [closeDlg]
    )

    return (
      <Dialog
        isOpen={isOpen}
        onClose={close}
        title={intl.formatMessage(bankId ? messages.titleEdit : messages.titleCreate)}
        primary={{
          title: intl.formatMessage(bankId ? messages.save : messages.create),
          onClick: save,
        }}
        secondary={{
          title: intl.formatMessage(messages.cancel),
          onClick: close,
        }}
      >
        <BankForm onClosed={close} ref={bankForm} bankId={bankId} />
      </Dialog>
    )
  }),
  {
    name: 'BankDialog',
    displayName: 'BankDialog',
  }
)

const messages = defineMessages({
  titleEdit: {
    id: 'BankDialog.titleEdit',
    defaultMessage: 'Edit Bank',
  },
  titleCreate: {
    id: 'BankDialog.titleCreate',
    defaultMessage: 'Add Bank',
  },
  save: {
    id: 'BankDialog.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'BankDialog.create',
    defaultMessage: 'Add',
  },
  cancel: {
    id: 'BankDialog.cancel',
    defaultMessage: 'Cancel',
  },
})
