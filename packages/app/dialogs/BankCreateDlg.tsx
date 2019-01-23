import React from 'react'
import { actions } from '../actions'
import { AppContext } from '../context'
import { BankForm } from '../forms'

export namespace BankCreateDlg {
  export interface Props {
    bankId?: string
  }
}

export class BankCreateDlg extends React.PureComponent<BankCreateDlg.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'BankCreateDlg'

  render() {
    const { bankId } = this.props
    const {
      dispatch,
      ui: { Page },
    } = this.context

    return (
      <Page>
        <BankForm onSaved={this.close} />
      </Page>
    )
  }

  close = () => {
    const { dispatch } = this.context
    dispatch(actions.dlg.close())
  }
}
