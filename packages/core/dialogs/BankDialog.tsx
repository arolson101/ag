import debug from 'debug'
import React, { useCallback, useContext, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext } from '../context'
import { BankForm } from '../forms'

const log = debug('app:BankDialog')

export interface BankDialogProps {
  bankId?: string
  isOpen: boolean
  cancelToken?: string
}

export const BankDialog = React.memo<BankDialogProps>(({ bankId, isOpen, cancelToken }) => {
  const {
    intl,
    ui: { Dialog },
    dispatch,
  } = useContext(AppContext)

  const bankForm = useRef<BankForm>(null)

  const save = useCallback(() => {
    if (bankForm.current) {
      bankForm.current.save()
    }
  }, [bankForm.current])

  const close = useCallback(() => {
    dispatch(actions.closeDlg('bank'))
  }, [dispatch])

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
      <BankForm onClosed={close} ref={bankForm} bankId={bankId} cancelToken={cancelToken} />
    </Dialog>
  )
})

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
