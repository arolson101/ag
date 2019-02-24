import debug from 'debug'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext } from '../context'
import { BankForm } from '../forms'

const log = debug('app:BankDialog')

export namespace BankDialog {
  export interface Props {
    bankId?: string
    isOpen: boolean
  }
}

export class BankDialog extends React.PureComponent<BankDialog.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankDialog'

  bankForm = React.createRef<BankForm>()

  render() {
    const { bankId, isOpen } = this.props
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter },
    } = this.context

    return (
      <Dialog
        isOpen={isOpen}
        onClose={this.close}
        title={intl.formatMessage(bankId ? messages.titleEdit : messages.titleCreate)}
      >
        <DialogBody>
          <BankForm onClosed={this.close} ref={this.bankForm} bankId={bankId} />
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(bankId ? messages.save : messages.create),
            onClick: this.save,
          }}
          secondary={{
            title: intl.formatMessage(messages.cancel),
            onClick: this.close,
          }}
        />
      </Dialog>
    )
  }

  save = () => {
    if (this.bankForm.current) {
      this.bankForm.current.save()
    }
  }

  close = () => {
    const { dispatch } = this.context
    dispatch(actions.closeDlg('bank'))
  }
}

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
