import { CompressedJson, dehydrate, hydrate, ISpec, iupdate } from '@ag/util'
import assert from 'assert'
import debug from 'debug'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

const log = debug('app:Record')

type Change<T> = Partial<ISpec<T>>

interface Update<T> {
  readonly t: number
  readonly q: Change<T>
}

export type BaseType<T> = CompressedJson<T>
export type HistoryType<T> = CompressedJson<Array<Update<T>>>

@Entity()
@Index(['_deleted', 'id'])
export abstract class Record<Props extends {}> {
  @PrimaryColumn() id!: string
  @Column() _deleted: number
  @Column('text', { nullable: true }) _base?: BaseType<Props>
  @Column('text', { nullable: true }) _history?: HistoryType<Props>

  constructor(id?: string, props?: Props) {
    this._deleted = 0
    this._base = undefined
    this._history = undefined

    if (props) {
      assert(!['id', '_deleted', '_base', '_history'].some(key => key in props))
      Object.assign(this, props)
      // log('props %o this %o', props, this)
    }

    if (id) {
      this.id = id
    }
  }

  update(t: number, q: Change<Props>) {
    const { id, _deleted, _base, _history, ...p } = this
    const props = (p as unknown) as Props
    const prevHistory = _history ? hydrate(_history) : []
    const change = { t, q }
    const changes = [...prevHistory, change].sort((a, b) => a.t - b.t)
    const isLatest = changes[changes.length - 1] === change
    const nextProps = isLatest
      ? iupdate(props, change.q as ISpec<Props>)
      : rebuildObject(props, _base, changes)

    Object.assign(this, {
      ...nextProps,
      id,
      _deleted,
      _base: _base || dehydrate(props),
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

const rebuildObject = <Props>(
  props: Props,
  _base: CompressedJson<Props> | undefined,
  changes: Array<Update<Props>>
): Props => {
  const base: Props = _base ? hydrate(_base) : props
  return changes.reduce((current, change) => iupdate(current, change.q as ISpec<Props>), base)
}