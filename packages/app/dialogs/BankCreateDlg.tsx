import React from 'react'
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

  render() {
    const { bankId, isOpen } = this.props
    const {
      dispatch,
      ui: { Dialog },
    } = this.context

    return (
      <Dialog isOpen={isOpen} onClose={this.close} title={bankId ? 'edit bank' : 'add bank'}>
        <BankForm onSaved={this.close} />
      </Dialog>
    )
  }

  close = () => {
    const { dispatch } = this.context
    dispatch(actions.dlg.close())
  }
}
