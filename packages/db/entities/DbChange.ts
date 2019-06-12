import { ISpec } from '@ag/util'
import { ObjectType } from 'typeorm'
import { DbEntity } from './DbEntity'

export interface DbEntityEdit<Q extends ISpec<{}> = ISpec<{}>> {
  id: string
  q: Q
}

export type DbTable = ObjectType<DbEntity<any>>

export interface DbChange {
  table: DbTable
  t: number
  adds?: Array<DbEntity<any>>
  deletes?: string[]
  edits?: DbEntityEdit[]
}
