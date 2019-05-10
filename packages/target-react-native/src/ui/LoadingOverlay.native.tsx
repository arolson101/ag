import { LoadingOverlayProps } from '@ag/core/context'
import { platform, Spinner } from '@ag/ui-nativebase'
import debug from 'debug'
import React, { useCallback, useEffect, useRef } from 'react'
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

export const LoadingOverlay = Object.assign(
  React.memo<LoadingOverlayProps>(function _LoadingOverlay({ show, title }) {
    const id = useRef(`overlay${idServer++}`)

    const showOverlay = useCallback(
      function _showOverlay() {
        // log('showOverlay %s', this.id)
        const passProps: OverlayProps = { title }
        Navigation.showOverlay({
          component: {
            id: id.current,
            name: overlayName,
            passProps,
          },
        })
      },
      [title]
    )

    const hideOverlay = useCallback(
      function _hideOverlay() {
        // log('hideOverlay %s', this.id)
        Navigation.dismissOverlay(id.current)
      },
      [id.current]
    )

    useEffect(() => {
      if (show) {
        showOverlay()
        return hideOverlay
      }
    }, [show])

    return null
  }),
  {
    displayName: 'LoadingOverlay',
  }
)

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
