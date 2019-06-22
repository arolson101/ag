import { selectors } from '@ag/core/reducers'
import assert from 'assert'
import debug from 'debug'
import { remote } from 'electron'
import React, { useCallback, useEffect, useState } from 'react'
import * as Mac from 'react-desktop/macOs'
import * as Win from 'react-desktop/windows'
import { useSelector } from 'react-redux'
import CheckBox from 'react-uwp/CheckBox'
import ListView from 'react-uwp/ListView'
import Separator from 'react-uwp/Separator'
import SplitViewCommand from 'react-uwp/SplitViewCommand'
import { getTheme, Theme as UWPThemeProvider } from 'react-uwp/Theme'

const log = debug('ElectronWindow')

interface Props extends React.Props<any> {
  hist: HistoryType
}

interface WindowProps extends Props {
  title: string
  theme: 'light' | 'dark'
  maximized: boolean
  color: string | undefined
  onCloseClick: () => any
  onMinimizeClick: () => any
  onMaximizeClick: () => any
  onRestoreDownClick: () => any
}

const baseStyle: React.CSSProperties = {
  margin: '10px 10px 10px 0',
}

const listSource = [
  {
    itemNode: <p>Text</p>,
  },
]
const listSource2 = [
  ...Array(10)
    .fill(0)
    .map((numb, index) => (
      <span key={`${index}`}>
        <span>Confirm{index + 1}</span>
        <span style={{ float: 'right' }}>$123.45</span>
      </span>
    )),
  <span>
    <span>Confirm</span>
    <CheckBox background='none' style={{ float: 'right' }} />
  </span>,
]

const WinWindow = Object.assign(
  React.memo<WindowProps>(function _WinWindow({ hist, theme, children, ...titleBarProps }) {
    const color = useSelector(selectors.getThemeColor)
    return (
      <Win.Window theme={theme} height='100%' width='100%'>
        {/* titlebar/menu is created via Titlebar in ElectronMenu */}
        {/* <Win.TitleBar controls {...titleBarProps} /> */}
        <div>{children}</div>
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
    const theme = useSelector(selectors.getTheme)
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
      theme,
      color,
      onCloseClick,
      onMinimizeClick,
      onMaximizeClick,
      onRestoreDownClick,
    }

    const Window = platform === 'mac' ? MacWindow : WinWindow

    assert(theme === 'light' || theme === 'dark')

    return (
      <Window {...windowProps}>
        <UWPThemeProvider
          theme={getTheme({
            themeName: theme,
            accent: color || '#0078D7', // set accent color
            useFluentDesign: true, // sure you want use new fluent design.
          })}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SplitViewCommand label='CalendarDay' icon={'\uE161'} visited />
            <ListView
              listSource={listSource2}
              style={baseStyle}
              // background='none'
              defaultFocusListIndex={3}
            />
            <SplitViewCommand icon={'\uE716'} />
            <SplitViewCommand label='Print' icon='PrintLegacy' />

            <SplitViewCommand label='Print' icon='PrintLegacy' visited />
            <Separator />
            <SplitViewCommand label='Print' icon='PrintLegacy' />
            <SplitViewCommand label='Settings' icon={'\uE713'} />
          </div>
          {props.children}
        </UWPThemeProvider>
      </Window>
    )
  }),
  { displayName: 'ElectronWindow' }
)
