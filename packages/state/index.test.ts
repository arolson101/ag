/* tslint:disable:no-implicit-dependencies */
import { StateObservable } from 'redux-observable'
import { of, Subject } from 'rxjs'
import { marbles } from 'rxjs-marbles'
import { delay } from 'rxjs/operators'
import { actions, createRoute, Dependencies } from './index'
import { RootState } from './reducers'

test(
  'navigation handler',
  marbles(m => {
    const { ac: navHome, eh: handleNavHome } = createRoute<{ foo: string }>('/home', 'asdf' as any)

    const dependencies: Dependencies = {
      runQuery: (document, variableValues) => of({ response: 123 }).pipe(delay(100)) as any,
    }

    const action$ = m.hot('a', {
      a: navHome({ foo: 'foo' }),
    })
    const expect$ = m.cold('100ms x', {
      x: actions.nav.navigate.success({ url: '/home', data: { response: 123 } }),
    })
    const state$ = {} as RootState
    const output$ = handleNavHome(
      action$ as any,
      new StateObservable(new Subject(), state$),
      dependencies
    )

    m.expect(output$).toBeObservable(expect$)
  })
)
