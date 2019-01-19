import { ActionType, createStandardAction } from 'typesafe-actions'
import { dialogActions } from './dialogActions'

interface AppNavDispatch {
  id: string
  props: object | void
}

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
