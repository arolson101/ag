import { CompressedJson, dehydrate, hydrate } from '@ag/util/dehydrate'
import { iupdate, Spec } from '@ag/util/iupdate'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

type Change<T> = Partial<Spec<T>>

interface Update<T> {
  readonly t: number
  readonly q: Change<T>
}

export type BaseType<T> = CompressedJson<T>
export type HistoryType<T> = CompressedJson<Array<Update<T>>>

type RecordSubclass<Props> = Props & Record<Props>

@Entity()
@Index(['_deleted', 'id'])
export abstract class Record<Props extends {}> {
  @PrimaryColumn() id!: string
  @Column() _deleted: number
  @Column('text', { nullable: true }) _base?: BaseType<Props>
  @Column('text', { nullable: true }) _history?: HistoryType<Props>

  constructor(props?: Props, genId?: () => string) {
    if (genId) {
      this.id = genId()
    }
    this._deleted = 0
    this._base = undefined
    this._history = undefined

    if (props) {
      Object.assign(this, props)
    }
  }

  static update<Props extends {}, R extends RecordSubclass<Props>>(
    entity: new (props?: Props) => R,
    obj: R,
    t: number,
    q: Change<Props>
  ): R {
    const { id, _deleted, _base, _history, ...p } = obj
    const props = (p as unknown) as Props
    const prevHistory = _history ? hydrate(_history) : []
    const change = { t, q }
    const changes = [...prevHistory, change].sort((a, b) => a.t - b.t)
    const isLatest = changes[changes.length - 1] === change
    const nextProps = isLatest
      ? iupdate(props, change.q as Spec<Props>)
      : rebuildObject(props, _base, changes)

    return new entity({
      ...nextProps,
      id,
      _deleted,
      _base: _base || dehydrate(props),
      _history: dehydrate(changes),
    })
  }

  static delete<Props extends {}, R extends RecordSubclass<Props>>(
    entity: new (props?: Props) => R,
    obj: R,
    t: number
  ): R {
    const { id, _deleted, _base, _history, ...p } = obj
    const props = (p as unknown) as Props
    return new entity({
      ...props,
      _deleted: Math.max(obj._deleted, t),
    })
  }
}

const rebuildObject = <Props>(
  props: Props,
  _base: CompressedJson<Props> | undefined,
  changes: Array<Update<Props>>
): Props => {
  const base: Props = _base ? hydrate(_base) : props
  return changes.reduce((current, change) => iupdate(current, change.q as Spec<Props>), base)
}
