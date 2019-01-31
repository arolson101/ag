import React from 'react'
import { connect } from 'react-redux'
import { AppAction } from '../actions'
import { AppContext } from '../context'
import { AppState } from '../reducers'
import { DialogState } from '../reducers/dialog'
import { AccountDialog } from './AccountDialog'
import { BankDialog } from './BankDialog'
import { LoginDialog } from './LoginDialog'

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

export const Dialogs = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    state: state.dialog,
  }) //
)(DialogsComponent)
