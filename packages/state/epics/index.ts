import { combineEpics, Epic } from 'redux-observable'
import { RootAction } from '../actions'
import { RootState } from '../reducers'
import { navEpics } from './navEpics'

export interface EpicType
  extends Epic<RootAction, RootAction, RootState, Services> {}

export interface Services {
  logger: (str: string) => any
}

export const rootEpic = combineEpics(
  ...navEpics //
)
