import { createStandardAction } from 'typesafe-actions'

interface AppNavDispatch {
  id: string
  props: object | void
}

export const navActions = {
  nav: {
    push: createStandardAction('nav/push')<AppNavDispatch>(),
    replace: createStandardAction('nav/replace')<AppNavDispatch>(),
    pop: createStandardAction('nav/pop')(),
  },
}
