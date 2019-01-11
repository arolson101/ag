import React from 'react'
import { connect } from 'react-redux'
import { actions, AlertConfig, AppAction } from '../actions'
import { AppContext } from '../context'
import { AppState } from '../reducers'

interface StateProps {
  alerts: AlertConfig[]
}

interface DispatchProps {
  dispatch: (action: AppAction) => any
}

interface Props extends StateProps, DispatchProps {}

export class DialogsComponent extends React.PureComponent<Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { alerts, dispatch } = this.props
    const { ui, intl } = this.context
    const { Alert } = ui
    return (
      <>
        {alerts.map((alert, idx) => (
          <Alert
            key={idx}
            show={alert.show}
            title={intl.formatMessage(alert.title.id, alert.title.values as any)}
            body={alert.body && alert.body.map(b => intl.formatMessage(b.id, b.values as any))}
            onConfirm={this.onConfirm}
            confirmText={intl.formatMessage(alert.confirmText)}
            onCancel={alert.cancelAction && (() => dispatch(alert.cancelAction!))}
            cancelText={alert.cancelText && intl.formatMessage(alert.cancelText)}
            onClosed={this.onClosed}
          />
        ))}
      </>
    )
  }

  onConfirm = () => {
    const { dispatch } = this.props
    dispatch(actions.dismissAlert())
  }

  onClosed = () => {
    const { dispatch, alerts } = this.props
    const alert = alerts[alerts.length - 1]
    dispatch(actions.popAlert())
    if (alert.confirmAction) {
      dispatch(alert.confirmAction)
    }
  }
}

export const Dialogs = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    alerts: state.dialog,
  }) //
)(DialogsComponent)
