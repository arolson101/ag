/* tslint:disable:no-implicit-dependencies */
import { ExecutionResult, GraphQLError } from 'graphql'
import { StateObservable } from 'redux-observable'
import { of, Subject } from 'rxjs'
import { marbles } from 'rxjs-marbles'
import { delay } from 'rxjs/operators'
import { actions } from '../actions'
import { createRoute } from '../epics'
import { RootState } from '../reducers'
import { Dependencies } from '../state'

test(
  'navigation success',
  marbles(m => {
    const { ac: navHome, eh: handleNavHome } = createRoute<{ foo: string }>('/home', 'asdf' as any)

    const dependencies: Dependencies = {
      runQuery: (document, variableValues) =>
        of<ExecutionResult>({ data: { response: 123 } }).pipe(delay(100)) as any,
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

test(
  'navigation failure',
  marbles(m => {
    const { ac: navHome, eh: handleNavHome } = createRoute<{ foo: string }>('/home', 'asdf' as any)
    const err = new GraphQLError('error navigating')

    const dependencies: Dependencies = {
      runQuery: (document, variableValues) =>
        of<ExecutionResult>({ errors: [err] }).pipe(delay(100)) as any,
    }

    const action$ = m.hot('a', {
      a: navHome({ foo: 'foo' }),
    })
    const expect$ = m.cold('100ms x', {
      x: actions.nav.navigate.failure({ url: '/home', errors: [err] }),
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
