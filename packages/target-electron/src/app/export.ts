import debug from 'debug'
import { remote } from 'electron'
import { Connection } from 'typeorm'
import XLSX from 'xlsx'

const { app, Menu, dialog } = remote

const log = debug('export')

export const exportDb = async (connection: Connection) => {
  log('export')

  const o = dialog.showSaveDialog({
    title: 'export',
    filters: [{ name: 'Excel', extensions: ['.xlsx'] }],
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
