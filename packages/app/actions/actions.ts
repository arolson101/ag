import { ActionType, createStandardAction } from 'typesafe-actions'
import { AppNavDispatch } from '../routes'
import { dialogActions } from './dialogActions'

export * from './dialogActions'

const nav = {
  push: createStandardAction('nav/push')<AppNavDispatch>(),
  replace: createStandardAction('nav/replace')<AppNavDispatch>(),
  pop: createStandardAction('nav/pop')(),
}

export const actions = {
  nav,
  ...dialogActions,
}

export type AppAction = ActionType<typeof actions>
