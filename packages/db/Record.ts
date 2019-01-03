import { pipe } from 'rxjs'
import { deflateRawSync, inflateRawSync } from 'zlib'
import { iupdate, Spec } from '@ag/util/iupdate'
import { hydrate, dehydrate, CompressedJson } from '@ag/util/dehydrate'
import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

type Change<T> = Partial<Spec<T>>

interface Update<T> {
  readonly t: number
  readonly q: Change<T>
}

export type BaseType<T> = CompressedJson<T>
export type HistoryType<T> = CompressedJson<Array<Update<T>>>

@Entity()
@Index(['_deleted', 'id'])
export abstract class Record<Props extends {}> {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column() _deleted: number
  @Column('text', { nullable: true }) _base?: BaseType<Props>
  @Column('text', { nullable: true }) _history?: HistoryType<Props>

  constructor(props?: Props) {
    // id is assigned by database
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
    change: Update<Props>
  ): R {
    const { id, _deleted, _base, _history, ...p } = obj
    const props = (p as unknown) as Props
    const prevHistory = _history ? hydrate(_history) : []
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

  static delete<Props extends {}, R extends RecordSubclass<Props>>(obj: R): R {
    return obj
  }
}

type RecordSubclass<Props> = Props & Record<Props>

const rebuildObject = <Props>(
  props: Props,
  _base: CompressedJson<Props> | undefined,
  changes: Array<Update<Props>>
): Props => {
  const base: Props = _base ? hydrate(_base) : props
  return changes.reduce((current, change) => iupdate(current, change.q as Spec<Props>), base)
}

export const updateRecord = <R extends T & IRecord<T>, T>(record: R, change: Update<T>): R => {
  const { id, _base, _deleted, _history, ...props } = record as IRecord<T>
  const prevHistory = _history ? hydrate(_history) : []
  const changes = [...prevHistory, change].sort((a, b) => a.t - b.t)
  const isLatest = changes[changes.length - 1] === change
  const next = isLatest ? iupdate(props, change.q) : rebuildObject(props, _base, changes)
  return {
    ...next,
    id,
    _deleted,
    _base: _base || dehydrate(props as T),
    _history: dehydrate(changes),
  } as R
}

export const deleteRecord = <R extends IRecord<T>, T>(record: R, t: number): R => {
  return { ...(record as {}), _deleted: t } as R
}
