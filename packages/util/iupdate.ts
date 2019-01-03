import { Context, Spec } from 'immutability-helper'

export { Spec }

const ctx = new Context()

ctx.extend(
  '$exclude',
  (param: string[], old: string[]): any => {
    return old.filter(x => !param.includes(x))
  }
)

export const iupdate = ctx.update
