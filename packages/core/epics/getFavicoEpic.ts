import { from, of, pipe } from 'rxjs'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { actions } from '../actions'
import { CoreEpic } from './CoreEpic'

const {
  online: { getFavico },
} = actions

// export const getFavicoEpic: CoreEpic = (action$, store, { axios }) =>
//   action$.pipe(
//     filter(isActionOf(getFavico.request))
//     switchMap(action =>
//       from(todosApi.getAll(action.payload)).pipe(
//         map(getFavico.success),
//         catchError(pipe(getFavico.failure, of))
//       )
//   )
