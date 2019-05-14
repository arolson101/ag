import debug from 'debug'
import { Connection } from 'typeorm'
import XLSX from 'xlsx'

const log = debug('export')

export const exportDb = async (connection: Connection) => {
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

  return XLSX.write(wb, { bookType: 'xlsx' })
}

export const importDb = async (connection: Connection, data: any) => {
  log('importDb')

  const wb = XLSX.read(data, { type: 'buffer' })
  // log('importDb %o', wb)
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName]
    const obj = XLSX.utils.sheet_to_json(sheet)

    const repo = connection.manager.getRepository(sheetName)
    const ents = obj.map(o => repo.create(o))
    log('importDb %s %o', sheetName, ents)
    if (ents.length) {
      await repo.insert(ents)
    }
  }
}
