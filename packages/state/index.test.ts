/* tslint:disable:no-implicit-dependencies */
import { StateObservable } from 'redux-observable'
import { of, Subject } from 'rxjs'
import { marbles } from 'rxjs-marbles'
import { delay } from 'rxjs/operators'
import { rootEpic } from './epics'
import { navHome } from './epics/navEpics'
import { actions, Services } from './index'
import { RootState } from './reducers'

const services: Services = {
  logger: () => {},
  runQuery: <T>(query: string) => of((123 as any) as T).pipe(delay(100)),
}

describe('navigation state', () => {
  test(
    'rootEpic marbles',
    marbles(m => {
      const action$ = m.hot('a', {
        a: navHome(),
      })
      const expect$ = m.cold('100ms x', {
        x: actions.nav.navigate.success({ url: '/home', data: 123 }),
      })
      const state$ = {} as RootState
      const output$ = rootEpic(action$ as any, new StateObservable(new Subject(), state$), services)

      m.expect(output$).toBeObservable(expect$)
    })
  )
})
