import { actions } from '@ag/core/actions'
import { IntlContext, useAction, useIntl, useSelector } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import { exportDb, importDb } from '@ag/db/export'
import { Color, RGBA, Titlebar } from 'custom-electron-titlebar'
import debug from 'debug'
import { MenuItemConstructorOptions, remote } from 'electron'
import fs from 'fs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { defineMessages } from 'react-intl'
import { Connection } from 'typeorm'
import './ElectronMenu.css'

const { dialog, Menu, systemPreferences } = remote

const log = debug('menu')

const opaque = (color: Color): Color => {
  const { r, g, b, a } = color.rgba
  return new Color(new RGBA(r, g, b))
}

export const ElectronMenu: React.FC = () => {
  const intl = useIntl()
  const isLoggedIn = useSelector(selectors.isLoggedIn)
  const connection = useSelector(selectors.getConnection)
  const platform = useSelector(selectors.getPlatform)
  const mode = useSelector(selectors.getThemeMode)
  const setThemeMode = useAction(actions.setThemeMode)
  const themeColor = useSelector(selectors.getThemeColor)
  const setThemeColor = useAction(actions.setThemeColor)
  const setPlatform = useAction(actions.setPlatform)
  const titleBar = useRef<Titlebar>()

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

  const importClicked = useCallback(() => {
    importFromFile(connection!, intl)
  }, [connection, importFromFile])

  const exportClicked = useCallback(() => {
    exportToFile(connection!, intl)
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
