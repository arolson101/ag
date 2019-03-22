import { CoreContext, LoadingOverlayProps } from '@ag/core'
import { platform, Spinner } from '@ag/ui-nativebase'
import debug from 'debug'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Navigation } from 'react-native-navigation'

const log = debug('rn:LoadingOverlay')

interface OverlayProps {
  title: string
}
class Overlay extends React.PureComponent<OverlayProps> {
  render() {
    const { title } = this.props
    const { height, width } = Dimensions.get('window')
    return (
      <View style={[styles.modalBackground, { height, width }]}>
        <View style={styles.activityIndicatorWrapper}>
          {/* <Text>{title}</Text> */}
          <Spinner color={platform.brandInfo} />
        </View>
      </View>
    )
  }
}

const overlayName = `loadingIndicator`
let idServer = 1

Navigation.registerComponent(overlayName, () => Overlay)

export class LoadingOverlay extends React.PureComponent<LoadingOverlayProps> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  shown: boolean
  id: string

  constructor(props: LoadingOverlayProps) {
    super(props)
    const { show } = this.props
    this.shown = false
    this.id = `overlay${idServer++}`
    if (show) {
      this.showOverlay()
    }
  }

  componentDidUpdate() {
    const { show } = this.props
    if (show !== this.shown) {
      if (show) {
        this.showOverlay()
      } else {
        this.hideOverlay()
      }
    }
  }

  componentWillUnmount() {
    if (this.shown) {
      this.hideOverlay()
    }
  }

  render() {
    return null
  }

  showOverlay() {
    // log('showOverlay %s', this.id)
    const { title } = this.props
    const passProps: OverlayProps = { title }
    Navigation.showOverlay({
      component: {
        id: this.id,
        name: overlayName,
        passProps,
      },
    })
    this.shown = true
  }

  hideOverlay() {
    // log('hideOverlay %s', this.id)
    Navigation.dismissOverlay(this.id)
    this.shown = false
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
