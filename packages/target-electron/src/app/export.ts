import { CoreStore, selectors } from '@ag/core/reducers'
import debug from 'debug'
import { MenuItemConstructorOptions, remote } from 'electron'
import { Connection } from 'typeorm'
import XLSX from 'xlsx'

const { app, Menu, MenuItem, dialog } = remote

const log = debug('export')

export const exportDb = async (connection: Connection) => {
  log('exportDb')

  const o = dialog.showSaveDialog({
    title: 'export',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })

  if (o) {
    const wb = XLSX.utils.book_new()
    for (const entityMetadata of connection.entityMetadatas) {
      const { tableName } = entityMetadata
      log(tableName)
      const repo = connection.manager.getRepository(tableName)
      const data = await repo.createQueryBuilder().getMany()
      const header = entityMetadata.columns.map(col => col.propertyName)
      const ws = XLSX.utils.json_to_sheet(data, { header })
      XLSX.utils.book_append_sheet(wb, ws, tableName)
    }

    XLSX.writeFile(wb, o)
  }
}

export const init = (store: CoreStore) => {
  const exportMenuItem = () => {
    log('exportMenuItem')
    const { connection } = selectors.getAppDb(store.getState())
    if (connection) {
      exportDb(connection)
    }
  }

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
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
