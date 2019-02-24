import { AlertProps } from '@ag/core'
import debug from 'debug'
import React from 'react'
import { Alert as RnAlert } from 'react-native'

const log = debug('rn:Alert')
log.enabled = true

export class Alert extends React.PureComponent<AlertProps> {
  componentDidMount() {
    if (this.props.show) {
      this.showAlert()
    }
  }

  componentDidUpdate(prevProps: AlertProps) {
    if (!prevProps.show && this.props.show) {
      this.showAlert()
    }
  }

  showAlert() {
    const { title, body, danger, onConfirm, confirmText, onCancel, cancelText } = this.props
    log('showing Alert %s %o', title, this.props)
    RnAlert.alert(
      title,
      body && body.join('\n'),
      [
        { text: cancelText, onPress: onCancel, style: 'cancel' }, //
        { text: confirmText, onPress: onConfirm, style: danger ? 'destructive' : 'default' },
      ],
      { cancelable: false }
    )
  }

  render() {
    return null
  }
}
