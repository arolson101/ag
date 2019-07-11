import debug from 'debug'
import React, { useCallback, useRef } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { useAction, useIntl, useUi } from '../context'
import { BillForm } from '../forms'

const log = debug('core:BillDialog')

export interface BillDialogProps {
  billId?: string
  isOpen: boolean
}

export const BillDialog = Object.assign(
  React.memo<BillDialogProps>(function _BillDialog({ billId, isOpen }) {
    const intl = useIntl()
    const closeDlg = useAction(actions.closeDlg)
    const { Dialog } = useUi()

    const billForm = useRef<BillForm>(null)

    const save = useCallback(
      function _save() {
        if (billForm.current) {
          billForm.current.save()
        }
      },
      [billForm.current]
    )

    const close = useCallback(
      function _close() {
        closeDlg('bill')
      },
      [closeDlg]
    )

    return (
      <Dialog
        isOpen={isOpen}
        onClose={close}
        title={intl.formatMessage(billId ? messages.titleEdit : messages.titleCreate)}
        primary={{
          title: intl.formatMessage(billId ? messages.save : messages.create),
          onClick: save,
        }}
        secondary={{
          title: intl.formatMessage(messages.cancel),
          onClick: close,
        }}
      >
        <BillForm onClosed={close} ref={billForm} billId={billId} />
      </Dialog>
    )
  }),
  {
    name: 'BillDialog',
    displayName: 'BillDialog',
  }
)

const messages = defineMessages({
  titleEdit: {
    id: 'BillDialog.titleEdit',
    defaultMessage: 'Edit Bill',
  },
  titleCreate: {
    id: 'BillDialog.titleCreate',
    defaultMessage: 'Add Bill',
  },
  save: {
    id: 'BillDialog.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'BillDialog.create',
    defaultMessage: 'Add',
  },
  cancel: {
    id: 'BillDialog.cancel',
    defaultMessage: 'Cancel',
  },
})
