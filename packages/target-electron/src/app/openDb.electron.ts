import debug from 'debug'
import electron from 'electron'
import fs from 'fs'
import path from 'path'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

const log = debug('electron:openDb')

const userData = (electron.remote || electron).app.getPath('userData')

export const openDb = async (
  name: string,
  key: string,
  entities: ConnectionOptions['entities']
): Promise<Connection> => {
  const type = 'sqlite'
  const database = path.join(userData, name + '.db')
  log('opening %s', database)
  const db = await createConnection({
    type,
    name,
    database,
    synchronize: true,
    entities,
    extra: {
      key,
    },
    logging: true,
  })
  log('opened')
  return db
}

export const deleteDb = async (name: string) => {
  log('deleteDb %s', name)
  const database = path.join(userData, name + '.db')
  fs.unlinkSync(database)
}
