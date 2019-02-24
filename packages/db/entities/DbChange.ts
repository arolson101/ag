import { ISpec } from '@ag/lib-util'
import { Record } from './Record'

export interface DbRecordEdit {
  id: string
  q: ISpec<{}>
}

type Table = any

export interface DbChange {
  table: Table
  t: number
  adds?: Array<Record<any>>
  deletes?: string[]
  edits?: DbRecordEdit[]
}
