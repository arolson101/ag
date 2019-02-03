import { AccountDialog, AppAction, AppContext, BankDialog, LoginDialog } from '@ag/app'
import React from 'react'
import { connect } from 'react-redux'
import { ElectronState } from '../reducers'
import { DialogState } from '../reducers/dialogReducer'

interface StateProps {
  state: DialogState
}

interface DispatchProps {
  dispatch: (action: AppAction) => any
}

interface Props extends StateProps, DispatchProps {}

export class DialogsComponent extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { state } = this.props

    return (
      <>
        <LoginDialog isOpen={!!state.login} />
        {state.bankDialog && <BankDialog {...state.bankDialog} />}
        {state.accountDialog && <AccountDialog {...state.accountDialog} />}
      </>
    )
  }
}

export const Dialogs = connect<StateProps, DispatchProps, {}, ElectronState>(
  state => ({
    state: state.dialog,
  }) //
)(DialogsComponent)
