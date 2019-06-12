import { CompressedJson, dehydrate, hydrate, ISpec, iupdate } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

const log = debug('db:Record')

type Change<T> = ISpec<T>

interface Update<T> {
  readonly t: number
  readonly q: Change<T>
}

export type HistoryType<T> = CompressedJson<Array<Update<T>>>

@Entity()
@Index(['_deleted', 'id'])
export abstract class DbEntity<Props extends {}> {
  @PrimaryColumn() id!: string
  @Column() _deleted: number
  @Column('text', { nullable: true }) _history?: HistoryType<Props>

  constructor(id?: string, props?: Props) {
    this._deleted = 0
    this._history = undefined

    if (props) {
      assert(!['id', '_deleted', '_history'].some(key => key in props))
      this.update(0, { $set: props })
      // log('props %o this %o', props, this)
    }

    if (id) {
      this.id = id
    }
  }

  update(t: number, q: Change<Props>) {
    const { id, _deleted, _history, ...p } = this
    const props = (p as unknown) as Props
    const prevHistory = _history ? hydrate(_history) : []
    const change = { t, q }
    const changes = [...prevHistory, change].sort((a, b) => a.t - b.t)
    const isLatest = changes[changes.length - 1] === change
    const nextProps = isLatest
      ? iupdate(props, change.q) //
      : rebuildObject(props, changes)

    Object.assign(this, {
      ...nextProps,
      id,
      _deleted,
      _history: dehydrate(changes),
    })
  }

  delete(t: number) {
    assert(t > 0)
    this._deleted = Math.max(this._deleted, t)
  }

  isDeleted(): boolean {
    return this._deleted > 0
  }
}

const rebuildObject = <Props>(props: Props, changes: Array<Update<Props>>): Props => {
  return changes.reduce((current, change) => iupdate(current, change.q), {} as Props)
}
