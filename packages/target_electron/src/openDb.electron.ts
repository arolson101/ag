import { log } from '@ag/util/log'
import electron from 'electron'
import fs from 'fs'
import path from 'path'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

const userData = electron.remote.app.getPath('userData')

export const openDb = async (
  name: string,
  key: string,
  entities: ConnectionOptions['entities']
): Promise<Connection> => {
  const type = 'sqlite'
  log.info('openDb %s', name)
  const db = await createConnection({
    type,
    name,
    database: path.join(userData, name + '.db'),
    synchronize: true,
    entities,
    extra: {
      key,
    },
    // logging: true,
  })
  return db
}

export const deleteDb = async (name: string) => {
  log.info('deleteDb %s', name)
  const database = path.join(userData, name + '.db')
  fs.unlinkSync(database)
}
