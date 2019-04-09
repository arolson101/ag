import { ISpec } from './iupdate'

export const diff = <T extends Record<string, any>>(base: T, next: Partial<T>): ISpec<T> => {
  return Object.keys(next).reduce(
    (q, prop): ISpec<T> => {
      const val = next[prop]
      if (val !== base[prop]) {
        return {
          ...q,
          [prop]: { $set: val },
        } as ISpec<T>
      } else {
        return q
      }
    },
    {} as ISpec<T>
  )
}
