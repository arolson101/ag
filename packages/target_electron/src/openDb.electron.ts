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
  const database = path.join(userData, name + '.db')
  log.db('opening %s', database)
  const db = await createConnection({
    type,
    name,
    database,
    synchronize: true,
    entities,
    extra: {
      key,
    },
    // logging: true,
  })
  log.db('opened')
  return db
}

export const deleteDb = async (name: string) => {
  log.db('deleteDb %s', name)
  const database = path.join(userData, name + '.db')
  fs.unlinkSync(database)
}
