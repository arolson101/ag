import { useSelector } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import debug from 'debug'
import { remote } from 'electron'
import React, { useCallback, useEffect, useState } from 'react'
import * as Mac from 'react-desktop/macOs'
import * as Win from 'react-desktop/windows'

const log = debug('ElectronWindow')

interface Props extends React.Props<any> {
  hist: HistoryType
}

interface WindowProps extends Props {
  title: string
  color: string
  mode: ThemeMode
  maximized: boolean
  onCloseClick: () => any
  onMinimizeClick: () => any
  onMaximizeClick: () => any
  onRestoreDownClick: () => any
}

const WinWindow = Object.assign(
  React.memo<WindowProps>(function _WinWindow({ hist, mode, color, children, ...titleBarProps }) {
    return (
      <Win.Window theme={mode} height='100%' width='100%' chrome color={color}>
        {/* titlebar/menu is created via Titlebar in ElectronMenu */}
        {/* <Win.TitleBar controls {...titleBarProps} /> */}
        {children}
      </Win.Window>
    )
  }),
  { displayName: 'WinWindow' }
)

const MacWindow = Object.assign(
  React.memo<WindowProps>(function _MacWindow({ hist, mode, color, children, ...titleBarProps }) {
    return (
      <Mac.Window theme={mode} chrome>
        <Mac.TitleBar controls {...titleBarProps} />
        {children}
      </Mac.Window>
    )
  }),
  { displayName: 'MacWindow' }
)

export const ElectronWindow = Object.assign(
  React.memo<Props>(function _ElectronWindow(props) {
    const [maximized, setMaximized] = useState(remote.getCurrentWindow().isMaximized())
    const title = window.document.title
    const mode = useSelector(selectors.getThemeMode)
    const platform = useSelector(selectors.getPlatform)
    const color = useSelector(selectors.getThemeColor)

    const onMinimizeClick = useCallback(() => {
      log('onMinimizeClick')
      const win = remote.getCurrentWindow()
      if (win.isMinimizable()) {
        win.minimize()
      }
    }, [])

    const onMaximizeClick = useCallback(() => {
      log('onMaximizeClick')
      const win = remote.getCurrentWindow()
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }, [])

    const onRestoreDownClick = useCallback(() => {
      log('onRestoreDownClick')
      const win = remote.getCurrentWindow()
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }, [])

    const onCloseClick = useCallback(() => {
      log('onCloseClick')
      const win = remote.getCurrentWindow()
      if (win.isClosable()) {
        win.close()
      }
    }, [])

    useEffect(() => {
      const win = remote.getCurrentWindow()
      const onMaximize = () => {
        log('onMaximize')
        setMaximized(true)
      }
      const onUnMaximize = () => {
        log('onUnMaximize')
        setMaximized(false)
      }

      win.addListener('maximize', onMaximize)
      win.addListener('unmaximize', onUnMaximize)

      return () => {
        win.removeListener('maximize', onMaximize)
        win.removeListener('unmaximize', onUnMaximize)
      }
    }, [])

    const windowProps = {
      ...props,
      maximized,
      title,
      mode,
      color,
      onCloseClick,
      onMinimizeClick,
      onMaximizeClick,
      onRestoreDownClick,
    }

    const Window = platform === 'mac' ? MacWindow : WinWindow

    return <Window {...windowProps}>{props.children}</Window>
  }),
  { displayName: 'ElectronWindow' }
)
