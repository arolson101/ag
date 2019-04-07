import { ISpec } from '@ag/util'
import { ObjectType } from 'typeorm'
import { Record } from './Record'

export interface DbRecordEdit<Q extends ISpec<{}> = ISpec<{}>> {
  id: string
  q: Q
}

type Table = ObjectType<Record<any>>

export interface DbChange {
  table: Table
  t: number
  adds?: Array<Record<any>>
  deletes?: string[]
  edits?: DbRecordEdit[]
}
