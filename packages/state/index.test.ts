import { StateObservable } from 'redux-observable'
import { Subject } from 'rxjs'
import { marbles } from 'rxjs-marbles'
import { rootEpic } from './epics'
import { actions, Services } from './index'
import { RootState } from './reducers'

const services: Services = {
  logger: () => {},
}

describe('navigation state', () => {
  test(
    'rootEpic marbles',
    marbles(m => {
      const action$ = m.hot('a', {
        a: actions.nav.home(),
      })
      const expect$ = m.cold('x 1s y', {
        x: actions.nav.loading.request(),
        y: actions.nav.loading.success(),
      })
      const state$ = {} as RootState
      const output$ = rootEpic(
        action$ as any,
        new StateObservable(new Subject(), state$),
        services
      )

      m.expect(output$).toBeObservable(expect$)
    })
  )
})
