import { App } from '@ag/core/app'
import { CoreStore } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import { online } from '@ag/online'
import { ui } from '@ag/ui-antd'
import { remote } from 'electron'
import React from 'react'
import * as Mac from 'react-desktop/macOs'
import * as Win from 'react-desktop/windows'
import { hot } from 'react-hot-loader/root'
import CheckBox from 'react-uwp/CheckBox'
import Icon from 'react-uwp/Icon'
import ListView, { ListViewProps } from 'react-uwp/ListView'
import NavigationView from 'react-uwp/NavigationView'
import Separator from 'react-uwp/Separator'
import SplitViewCommand from 'react-uwp/SplitViewCommand'
import { getTheme, Theme as UWPThemeProvider } from 'react-uwp/Theme'
import Toggle from 'react-uwp/Toggle'
import { ElectronDialogs } from './ElectronDialogs'
import { ElectronMenu } from './ElectronMenu'
import { ElectronRouter } from './ElectronRouter'
import { sys } from './store'

interface Props {
  store: CoreStore
  hist: HistoryType
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

const ElectronApp = React.memo<Props>(function _ElectronApp(props) {
  const { store, hist } = props
  const [width, height] = remote.getCurrentWindow().getSize()

  return (
    // <App {...{ sys, ui, store, online }}>
    <Win.Window theme={'light'} chrome>
      <Win.TitleBar
        title='My Windows Application'
        controls
        isMaximized={false}
        // background={this.props.color}
        // onCloseClick={close}
        // onMinimizeClick={minimize}
        // onMaximizeClick={maximize}
        // onRestoreDownClick={maximize}
      />

      <UWPThemeProvider
        theme={getTheme({
          themeName: 'light', // set custom theme
          accent: '#0078D7', // set accent color
          useFluentDesign: true, // sure you want use new fluent design.
          // desktopBackgroundImage: 'http://127.0.0.1:8092/static/images/jennifer-bailey-10753.jpg', // set global desktop background image
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
      </UWPThemeProvider>

      {/* <ElectronMenu /> */}
      {/* <ElectronRouter hist={hist} /> */}
      {/* <ElectronDialogs /> */}
    </Win.Window>
    // </App>
  )
})

export const start = (store: CoreStore) => {
  // store.dispatch(thunks.init())
}

export default hot(ElectronApp)
