import { CoreStore, selectors } from '@ag/core/reducers'
import { exportDb, importDb } from '@ag/db/export'
import debug from 'debug'
import { MenuItemConstructorOptions, remote } from 'electron'
import fs from 'fs'
import { Connection } from 'typeorm'

const { app, Menu, MenuItem, dialog } = remote

const log = debug('menu')

const exportToFile = async (connection: Connection) => {
  log('exportToFile')

  const o = dialog.showSaveDialog({
    title: 'export',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })

  if (o) {
    const data = await exportDb(connection)
    fs.writeFileSync(o, data)
  }
}

const importFromFile = async (connection: Connection) => {
  log('importFromFile')

  const o = dialog.showOpenDialog({
    title: 'import',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })

  if (o && o.length > 0) {
    const data = fs.readFileSync(o[0])
    await importDb(connection, data)
  }
}

export const init = (store: CoreStore) => {
  const exportMenuItem = () => {
    // log('exportMenuItem')
    const { connection } = selectors.getAppDb(store.getState())
    if (connection) {
      exportToFile(connection)
    }
  }

  const importMenuItem = () => {
    // log('exportMenuItem')
    const { connection } = selectors.getAppDb(store.getState())
    if (connection) {
      importFromFile(connection)
    }
  }

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import',
          click: importMenuItem,
        },
        {
          label: 'Export',
          click: exportMenuItem,
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal('https://electronjs.org')
          },
        },
      ],
    },
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })

    // Edit menu
    ;(template[1].submenu! as MenuItemConstructorOptions[]).push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
