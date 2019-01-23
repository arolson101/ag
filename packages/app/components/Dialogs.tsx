import React from 'react'
import { connect } from 'react-redux'
import { getType } from 'typesafe-actions'
import { actions, AppAction } from '../actions'
import { AppContext } from '../context'
import { BankCreateDlg } from '../dialogs'
import { AppState } from '../reducers'

interface StateProps {
  action: AppAction | undefined
}

interface DispatchProps {
  dispatch: (action: AppAction) => any
}

interface Props extends StateProps, DispatchProps {}

export class DialogsComponent extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { action } = this.props

    if (!action) {
      return null
    }

    switch (action.type) {
      case getType(actions.dlg.bankCreate):
        return <BankCreateDlg />
      case getType(actions.dlg.bankEdit):
        return <BankCreateDlg {...action.payload} />
      default:
        return null
    }
  }

  onClosed = () => {
    const { dispatch } = this.props
    dispatch(actions.dlg.close())
  }
}

export const Dialogs = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    action: state.dialog.action,
  }) //
)(DialogsComponent)
