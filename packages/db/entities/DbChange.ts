import { ISpec } from '@ag/util'
import { AppTable } from './appEntities'
import { DbEntity } from './DbEntity'

export interface DbEntityEdit<Q extends ISpec<{}> = ISpec<{}>> {
  id: string
  q: Q
}

export interface DbChange {
  table: AppTable
  t: number
  adds?: Array<DbEntity<any>>
  deletes?: string[]
  edits?: DbEntityEdit[]
}
