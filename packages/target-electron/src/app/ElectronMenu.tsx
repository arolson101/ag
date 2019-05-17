import { IntlContext, useIntl, useSelector } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import { exportDb, importDb } from '@ag/db/export'
import debug from 'debug'
import { app, remote } from 'electron'
import fs from 'fs'
import React, { useCallback } from 'react'
import { MenuItem, Provider, WindowMenu as MainMenu } from 'react-electron-menu'
import { defineMessages } from 'react-intl'
import { Connection } from 'typeorm'

const { dialog } = remote

const log = debug('menu')

export const ElectronMenu: React.FC = () => {
  const isMac = process.platform === 'darwin'
  const intl = useIntl()
  const isLoggedIn = useSelector(selectors.isLoggedIn)
  const connection = useSelector(selectors.getConnection)

  const importClicked = useCallback(() => {
    importFromFile(connection!, intl)
  }, [connection, importFromFile])

  const exportClicked = useCallback(() => {
    exportToFile(connection!, intl)
  }, [connection, exportToFile])

  return (
    <Provider electron={require('electron')}>
      <MainMenu>
        {isMac && (
          <MenuItem label={app.getName()}>
            <MenuItem role='about' />
            <MenuItem type='separator' />
            <MenuItem role='services' />
            <MenuItem type='separator' />
            <MenuItem role='hide' />
            <MenuItem role='hideothers' />
            <MenuItem role='unhide' />
            <MenuItem type='separator' />
            <MenuItem role='quit' />
          </MenuItem>
        )}

        <MenuItem label={intl.formatMessage(messages.file)}>
          <MenuItem
            enabled={isLoggedIn}
            label={intl.formatMessage(messages.import)}
            onClick={importClicked}
          />
          <MenuItem
            enabled={isLoggedIn}
            label={intl.formatMessage(messages.export)}
            onClick={exportClicked}
          />
          <MenuItem type='separator' />
          <MenuItem role={isMac ? 'close' : 'quit'} />
        </MenuItem>

        <MenuItem label={intl.formatMessage(messages.edit)}>
          <MenuItem role='undo' />
          <MenuItem role='redo' />
          <MenuItem type='separator' />
          <MenuItem role='cut' />
          <MenuItem role='copy' />
          <MenuItem role='paste' />
          <MenuItem role='pasteandmatchstyle' />
          <MenuItem role='delete' />
          <MenuItem role='selectall' />

          {isMac && (
            <>
              <MenuItem type='separator' />
              <MenuItem label='Speech'>
                <MenuItem role='startspeaking' />
                <MenuItem role='stopspeaking' />
              </MenuItem>
            </>
          )}
        </MenuItem>

        <MenuItem label={intl.formatMessage(messages.view)}>
          <MenuItem role='reload' />
          <MenuItem role='forcereload' />
          <MenuItem role='toggledevtools' />
          <MenuItem type='separator' />
          <MenuItem role='resetzoom' />
          <MenuItem role='zoomin' />
          <MenuItem role='zoomout' />
          <MenuItem type='separator' />
          <MenuItem role='togglefullscreen' />
        </MenuItem>

        <MenuItem label={intl.formatMessage(messages.window)}>
          <MenuItem role='minimize' />
          <MenuItem role='close' />

          {isMac && (
            <>
              <MenuItem role='close' />
              <MenuItem role='minimize' />
              <MenuItem role='zoom' />
              <MenuItem type='separator' />
              <MenuItem role='front' />
            </>
          )}
        </MenuItem>

        <MenuItem label={intl.formatMessage(messages.help)}>
          <MenuItem
            label='Learn More'
            onClick={() => {
              remote.shell.openExternal('https://electronjs.org')
            }}
          />
        </MenuItem>
      </MainMenu>
    </Provider>
  )
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
    defaultMessage: 'E&xport',
  },
  exportDialogTitle: {
    id: 'ElectronMenu.exportDialogTitle',
    defaultMessage: 'Export',
  },
  import: {
    id: 'ElectronMenu.import',
    defaultMessage: '&Import',
  },
  importDialogTitle: {
    id: 'ElectronMenu.importDialogTitle',
    defaultMessage: 'Import',
  },
})
