import { AlertProps } from '@ag/app'
import { Button, Text, View } from 'native-base'
import React from 'react'
import { Modal } from 'react-native'

export class Alert extends React.PureComponent<AlertProps> {
  render() {
    const { show, title, body, danger, onConfirm, confirmText, onCancel, cancelText } = this.props
    return (
      <Modal visible={show} transparent onRequestClose={onCancel}>
        <View>
          <Text>{title}</Text>
        </View>
        <View>{body && body.map((b, i) => <Text key={i}>{b}</Text>)}</View>
        <View>
          <Button block onPress={onCancel}>
            {cancelText}
          </Button>
          <Button block danger={danger} onPress={onConfirm}>
            {confirmText}
          </Button>
        </View>
      </Modal>
    )
  }
}
