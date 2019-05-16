import { CoreDependencies } from '@ag/core/context'
import { coreEpics } from '@ag/core/epics'
import { combineEpics, Epic } from 'redux-observable'
import { ElectronAction, ElectronState } from '../reducers'
import { navEpics } from './navEpics'

export type ElectronEpic = Epic<ElectronAction, ElectronAction, ElectronState, CoreDependencies>

export const epics: ElectronEpic[] = [
  ...((coreEpics as unknown) as ElectronEpic[]), //
  ...navEpics,
]

export const rootEpic = combineEpics<
  ElectronAction,
  ElectronAction,
  ElectronState,
  CoreDependencies
>(...epics)
