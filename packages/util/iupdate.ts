import { Context, Spec } from 'immutability-helper'

export { Spec }

const ctx = new Context()

ctx.extend(
  '$exclude',
  (param: string[], old: string[]): any => {
    return old.filter(x => !param.includes(x))
  }
)

ctx.extend(
  '$plus',
  (param: number, old: number): any => {
    if (typeof param !== 'number') {
      throw new Error('parameter to $plus must be a number')
    }
    if (typeof old !== 'number') {
      throw new Error('target of $plus must be a number')
    }
    return param + old
  }
)

export const iupdate = ctx.update
