import { Context, CustomCommands, Spec } from 'immutability-helper'

type AddedCommands =
  | {
      $plus: number
    }
  | {
      $exclude: any[]
    }

export type ISpec<T> = Spec<T, CustomCommands<AddedCommands>>

const ctx = new Context()

ctx.extend<string[]>(
  '$exclude', //
  (param, old) => {
    return old.filter(x => !param.includes(x))
  }
)

ctx.extend<number>(
  '$plus', //
  (param, old) => {
    if (typeof param !== 'number') {
      throw new Error('parameter to $plus must be a number')
    }
    if (typeof old !== 'number') {
      throw new Error('target of $plus must be a number')
    }
    return param + old
  }
)

export const iupdate = ctx.update as <T>(object: T, $spec: ISpec<T>) => T
