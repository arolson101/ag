import { actions } from '@ag/core/actions'
import { IntlContext, UiContext, useAction, useIntl, useSelector, useUi } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import { exportDb, exportExt, importDb } from '@ag/db/export'
import { Color, RGBA, Titlebar } from 'custom-electron-titlebar'
import debug from 'debug'
import { MenuItemConstructorOptions, remote } from 'electron'
import fs from 'fs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { defineMessages } from 'react-intl'
import { Connection } from 'typeorm'
import './ElectronMenu.css'

const { dialog, Menu, systemPreferences } = remote

const log = debug('electron:menu')

const opaque = (color: Color): Color => {
  const { r, g, b, a } = color.rgba
  return new Color(new RGBA(r, g, b))
}

export const ElectronMenu: React.FC = () => {
  const intl = useIntl()
  const ui = useUi()
  const isLoggedIn = useSelector(selectors.isLoggedIn)
  const connection = useSelector(selectors.connection)
  const platform = useSelector(selectors.platform)
  const mode = useSelector(selectors.themeMode)
  const setThemeMode = useAction(actions.setThemeMode)
  const themeColor = useSelector(selectors.themeColor)
  const setThemeColor = useAction(actions.setThemeColor)
  const setPlatform = useAction(actions.setPlatform)
  const dbClose = useAction(thunks.dbClose)
  const titleBar = useRef<Titlebar>()
  const dbReloadAll = useAction(thunks.dbReloadAll)

  useEffect(() => {
    if (remote.process.platform !== 'darwin') {
      // if (platform !== 'mac') {
      const tb = new Titlebar({
        backgroundColor: opaque(Color.fromHex(themeColor)),
      })

      const onColorChanged = (event: Event, newColor: string) => {
        log('onColorChanged: %s', newColor)
        setThemeColor('#' + newColor)
      }
      systemPreferences.addListener('accent-color-changed', onColorChanged)

      titleBar.current = tb

      return () => {
        tb.dispose()
        systemPreferences.removeListener('accent-color-changed', onColorChanged)
      }
    }
  }, [platform, themeColor])

  const importClicked = useCallback(async () => {
    await importFromFile(connection!, intl, ui)
    await dbReloadAll()
  }, [connection, importFromFile])

  const exportClicked = useCallback(() => {
    exportToFile(connection!, intl, ui)
  }, [connection, exportToFile])

  useEffect(() => {
    const template: MenuItemConstructorOptions[] = [
      ...(platform === 'mac' ? [{ role: 'appMenu' as any }] : []),
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
          {
            enabled: isLoggedIn,
            label: intl.formatMessage(messages.logout),
            click: dbClose,
          },
          { type: 'separator' },
          platform === 'mac' ? { role: 'close' } : { role: 'quit' },
        ],
      },
      { role: 'editMenu' },
      { role: 'viewMenu' },
      {
        label: 'theme',
        submenu: [
          ...(['pc', 'mac', 'linux'] as const).map(
            (plat): MenuItemConstructorOptions => ({
              label: `set platform: ${plat}`,
              checked: platform === plat,
              click: () => {
                setPlatform(plat)
              },
            })
          ),
          { type: 'separator' },
          ...(['light', 'dark'] as const).map(
            (t): MenuItemConstructorOptions => ({
              label: `set theme: ${t}`,
              checked: mode === t,
              click: () => {
                setThemeMode(t)
              },
            })
          ),
        ],
      },
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
  }, [isLoggedIn, importClicked, exportClicked, mode, setThemeMode, platform, setPlatform])

  return null
}

const exportToFile = async (connection: Connection, intl: IntlContext, ui: UiContext) => {
  log('exportToFile')

  const path = dialog.showSaveDialog(remote.getCurrentWindow(), {
    title: intl.formatMessage(messages.exportDialogTitle),
    filters: [{ name: 'Archive', extensions: [exportExt] }],
  })

  if (path) {
    const data = await exportDb(connection)
    fs.writeFileSync(path, data, { encoding: 'base64' })
    ui.showToast(intl.formatMessage(messages.exportComplete, { path }))
  }
}

const importFromFile = async (connection: Connection, intl: IntlContext, ui: UiContext) => {
  log('importFromFile')

  const o = dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: intl.formatMessage(messages.importDialogTitle),
    filters: [{ name: 'Archive', extensions: [exportExt] }],
  })

  if (o && o.length > 0) {
    const path = o[0]
    const data = fs.readFileSync(path)
    await importDb(connection, data)
    ui.showToast(intl.formatMessage(messages.importComplete, { path }))
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
  logout: {
    id: 'ElectronMenu.logout',
    defaultMessage: 'Logout',
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
  importComplete: {
    id: 'ElectronMenu.importComplete',
    defaultMessage: 'Imported data from {path}',
  },
  exportComplete: {
    id: 'ElectronMenu.exportComplete',
    defaultMessage: 'Exported data to {path}',
  },
})
