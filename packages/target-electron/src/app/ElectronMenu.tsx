import { IntlContext, useIntl, useSelector } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import { exportDb, importDb } from '@ag/db/export'
import { Color, Titlebar } from 'custom-electron-titlebar'
import debug from 'debug'
import { MenuItemConstructorOptions, remote } from 'electron'
import fs from 'fs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, TitleBar, Toolbar } from 'react-desktop/macOs'
import { defineMessages } from 'react-intl'
import { Connection } from 'typeorm'
import './ElectronMenu.css'

const { dialog, Menu } = remote

const log = debug('menu')

export const ElectronMenu: React.FC = () => {
  const isMac = process.platform === 'darwin' // || true
  const intl = useIntl()
  const isLoggedIn = useSelector(selectors.isLoggedIn)
  const connection = useSelector(selectors.getConnection)
  const titleBar = useRef<Titlebar>()

  useEffect(() => {
    if (!isMac) {
      const tb = new Titlebar({
        backgroundColor: Color.fromHex('#ECECEC'),
      })

      titleBar.current = tb
      return () => tb.dispose()
    }
  }, [isMac])

  const importClicked = useCallback(() => {
    importFromFile(connection!, intl)
  }, [connection, importFromFile])

  const exportClicked = useCallback(() => {
    exportToFile(connection!, intl)
  }, [connection, exportToFile])

  useEffect(() => {
    const template: MenuItemConstructorOptions[] = [
      ...(isMac ? [{ role: 'appMenu' as any }] : []),
      {
        role: 'fileMenu' as any,
        submenu: [
          {
            enabled: isLoggedIn,
            label: intl.formatMessage(messages.import),
            click: importClicked,
          },
          {
            enabled: isLoggedIn,
            label: intl.formatMessage(messages.export),
            click: exportClicked,
          },
          { type: 'separator' },
          isMac ? { role: 'close' } : { role: 'quit' },
        ],
      },
      { role: 'editMenu' },
      { role: 'viewMenu' },
      { role: 'windowMenu' },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              require('electron').shell.openExternalSync('https://electronjs.org')
            },
          },
        ],
      },
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    if (titleBar.current) {
      titleBar.current.updateMenu(menu)
    }
  }, [isLoggedIn, importClicked, exportClicked])

  const minimize = useCallback(() => {
    const win = remote.getCurrentWindow()
    if (win.isMinimizable()) {
      win.minimize()
    }
  }, [])

  const maximize = useCallback(() => {
    const win = remote.getCurrentWindow()
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }, [])

  const close = useCallback(() => {
    const win = remote.getCurrentWindow()
    if (win.isClosable()) {
      win.close()
    }
  }, [])

  const [maximized, setMaximized] = useState(remote.getCurrentWindow().isMaximized())
  useEffect(() => {
    const win = remote.getCurrentWindow()
    const onMaximize = () => {
      setMaximized(true)
    }
    const onUnMaximize = () => {
      setMaximized(false)
    }

    win.addListener('maximize', onMaximize)
    win.addListener('unmaximize', onUnMaximize)

    return () => {
      win.removeListener('maximize', onMaximize)
      win.removeListener('unmaximize', onUnMaximize)
    }
  }, [])

  if (isMac) {
    return (
      <div style={{ zIndex: 1001, position: 'relative' }}>
        <TitleBar
          isFullscreen={maximized}
          controls
          inset
          onCloseClick={close}
          // onMaximizeClick={maximize}
          onMinimizeClick={minimize}
          // onResizeClick={maximize}
        >
          <Toolbar horizontalAlignment='center'>
            <Text>{window.document.title}</Text>
          </Toolbar>
        </TitleBar>
      </div>
    )
  } else {
    return null
  }
}

const exportToFile = async (connection: Connection, intl: IntlContext) => {
  log('exportToFile')

  const o = dialog.showSaveDialog({
    title: intl.formatMessage(messages.exportDialogTitle),
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })

  if (o) {
    const data = await exportDb(connection)
    fs.writeFileSync(o, data)
  }
}

const importFromFile = async (connection: Connection, intl: IntlContext) => {
  log('importFromFile')

  const o = dialog.showOpenDialog({
    title: intl.formatMessage(messages.importDialogTitle),
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })

  if (o && o.length > 0) {
    const data = fs.readFileSync(o[0])
    await importDb(connection, data)
  }
}

const messages = defineMessages({
  file: {
    id: 'ElectronMenu.file',
    defaultMessage: '&File',
  },
  edit: {
    id: 'ElectronMenu.edit',
    defaultMessage: '&Edit',
  },
  view: {
    id: 'ElectronMenu.view',
    defaultMessage: '&View',
  },
  window: {
    id: 'ElectronMenu.window',
    defaultMessage: '&Window',
  },
  help: {
    id: 'ElectronMenu.help',
    defaultMessage: '&Help',
  },
  export: {
    id: 'ElectronMenu.export',
    defaultMessage: 'E&xport...',
  },
  exportDialogTitle: {
    id: 'ElectronMenu.exportDialogTitle',
    defaultMessage: 'Export',
  },
  import: {
    id: 'ElectronMenu.import',
    defaultMessage: '&Import...',
  },
  importDialogTitle: {
    id: 'ElectronMenu.importDialogTitle',
    defaultMessage: 'Import',
  },
})
