import { CompressedJson, ISpec } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Entity, PrimaryColumn } from 'typeorm'

const log = debug('db:Record')

type Change<T> = ISpec<T>

interface Update<T> {
  readonly t: number
  readonly q: Change<T>
}

export type HistoryType<T> = CompressedJson<Array<Update<T>>>

export type DbEntityKeys = keyof DbEntity<{}>

const dbEntityKeys: Array<keyof DbEntity<{}>> = ['id' /* '_deleted', '_history'*/]

@Entity()
export abstract class DbEntity<Props extends {}> {
  @PrimaryColumn() id!: string

  constructor(id?: string, props?: Props) {
    if (props) {
      assert(!dbEntityKeys.some(key => key in props))
      Object.assign(this, props)
    }

    if (id) {
      this.id = id
    }
  }
}
