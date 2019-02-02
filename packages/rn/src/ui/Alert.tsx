import { AlertProps } from '@ag/app'
import debug from 'debug'
import { Button, Text, View } from 'native-base'
import React from 'react'
import { Modal } from 'react-native'

const log = debug('rn:Alert')
log.enabled = true

export class Alert extends React.PureComponent<AlertProps> {
  render() {
    const { show, title, body, danger, onConfirm, confirmText, onCancel, cancelText } = this.props
    log('showing Alert %s %o', title, this.props)
    return (
      <Modal visible={show} transparent onRequestClose={this.onRequestClose}>
        <View>
          <Text>{title}</Text>
        </View>
        <View>{body && body.map((b, i) => <Text key={i}>{b}</Text>)}</View>
        <View>
          <Button block onPress={onCancel}>
            <Text>{cancelText}</Text>
          </Button>
          <Button block danger={danger} onPress={onConfirm}>
            <Text>{confirmText}</Text>
          </Button>
        </View>
      </Modal>
    )
  }

  onRequestClose = () => {
    const { onCancel } = this.props
    if (onCancel) {
      onCancel()
    } else {
      log('Alert onRequestClose')
    }
  }
}
