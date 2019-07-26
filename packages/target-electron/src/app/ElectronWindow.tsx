import { useSelector } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import assert from 'assert'
import debug from 'debug'
import { remote } from 'electron'
import React, { useCallback, useEffect, useState } from 'react'
import * as Mac from 'react-desktop/macOs'
import * as Win from 'react-desktop/windows'

const log = debug('electron:ElectronWindow')

interface Props extends React.Props<any> {
  hist: HistoryType
}

interface WindowProps extends Props {
  title: string
  themeColor: string
  mode: ThemeMode
  maximized: boolean
  onCloseClick: () => any
  onMinimizeClick: () => any
  onMaximizeClick: () => any
  onRestoreDownClick: () => any
}

const WinWindow = Object.assign(
  React.memo<WindowProps>(function _WinWindow({
    hist,
    mode,
    themeColor: color,
    children,
    ...titleBarProps
  }) {
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
  React.memo<WindowProps>(function _MacWindow(props) {
    const { onCloseClick, onMaximizeClick, onMinimizeClick, title, maximized, children } = props
    const titleBarProps = {
      onCloseClick,
      onMaximizeClick,
      onMinimizeClick,
      title,
      isFullscreen: maximized,
    }
    return (
      <Mac.Window chrome padding={0}>
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
    const mode = useSelector(selectors.themeMode)
    const platform = useSelector(selectors.platform)
    const themeColor = useSelector(selectors.themeColor)

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

    const windowProps: WindowProps = {
      ...props,
      maximized,
      title,
      mode,
      themeColor,
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
