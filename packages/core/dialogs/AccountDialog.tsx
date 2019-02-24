import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext } from '../context'
import { AccountForm } from '../forms'

export namespace AccountDialog {
  export interface Props {
    bankId: string
    accountId?: string
    isOpen: boolean
  }
}

export class AccountDialog extends React.PureComponent<AccountDialog.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'AccountDialog'

  AccountForm = React.createRef<AccountForm>()

  render() {
    const { bankId, accountId, isOpen } = this.props
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter },
    } = this.context

    return (
      <Dialog
        isOpen={isOpen}
        onClose={this.close}
        title={intl.formatMessage(accountId ? messages.titleEdit : messages.titleCreate)}
      >
        <DialogBody>
          <AccountForm
            onClosed={this.close}
            ref={this.AccountForm}
            bankId={bankId}
            accountId={accountId}
          />
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(accountId ? messages.save : messages.create),
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
    if (this.AccountForm.current) {
      this.AccountForm.current.save()
    }
  }

  close = () => {
    const { dispatch } = this.context
    dispatch(actions.closeDlg('account'))
  }
}

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