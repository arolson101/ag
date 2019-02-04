import { AppContext, LoadingOverlayProps } from '@ag/app'
import debug from 'debug'
import { Spinner as NBSpinner, Text, View } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import * as React from 'react'
import { Dimensions, Modal, StyleSheet } from 'react-native'

const log = debug('rn:LoadingOverlay')
log.enabled = true

export class LoadingOverlay extends React.PureComponent<LoadingOverlayProps> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { title, show: visible /*cancelable, onCancel*/ } = this.props
    const { height, width } = Dimensions.get('window')

    return (
      <Modal
        transparent={true} //
        animationType={'fade'}
        visible={visible}
        onRequestClose={this.onRequestClose}
      >
        <View style={[styles.modalBackground, { height, width }]}>
          <View style={styles.activityIndicatorWrapper}>
            <Text>{title}</Text>
            <NBSpinner color={platform.brandInfo} />
          </View>
        </View>
      </Modal>
    )
  }

  onRequestClose = () => {
    log('modal onRequestClose')
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000080',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    minHeight: 100,
    minWidth: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
})
