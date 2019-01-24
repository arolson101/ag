import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext } from '../context'
import { BankForm } from '../forms'

export namespace BankCreateDlg {
  export interface Props {
    bankId?: string
    isOpen: boolean
  }
}

export class BankCreateDlg extends React.PureComponent<BankCreateDlg.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankCreateDlg'

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
          <BankForm onSaved={this.close} ref={this.bankForm} />
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(bankId ? messages.save : messages.create),
            onClick: this.save,
          }}
          secondary={{
            title: intl.formatMessage(messages.cancel), //
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
    dispatch(actions.dlg.close())
  }
}

const messages = defineMessages({
  titleEdit: {
    id: 'BankCreateDlg.titleEdit',
    defaultMessage: 'Edit Bank',
  },
  titleCreate: {
    id: 'BankCreateDlg.titleCreate',
    defaultMessage: 'Add Bank',
  },
  save: {
    id: 'BankCreateDlg.save',
    defaultMessage: 'Save',
  },
  create: {
    id: 'BankCreateDlg.create',
    defaultMessage: 'Add',
  },
  cancel: {
    id: 'BankCreateDlg.cancel',
    defaultMessage: 'Cancel',
  },
})
