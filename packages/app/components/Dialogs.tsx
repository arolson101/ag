import React from 'react'
import { connect } from 'react-redux'
import { actions, AppAction } from '../actions'
import { AppContext } from '../context'
import { BankCreateDlg } from '../dialogs'
import { AppState } from '../reducers'
import { DialogState } from '../reducers/dialog'

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
    const {
      ui: { Dialog },
    } = this.context

    return (
      <>
        {state.bankCreate && <BankCreateDlg {...state.bankCreate} />}
        {state.bankEdit && <BankCreateDlg {...state.bankEdit} />}
      </>
    )
  }
}

export const Dialogs = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    state: state.dialog,
  }) //
)(DialogsComponent)
