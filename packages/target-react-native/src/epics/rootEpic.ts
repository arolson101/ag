import { CoreAction, CoreDependencies, CoreState } from '@ag/core'
import { CoreEpic, coreEpics } from '@ag/core/epics'
import { combineEpics } from 'redux-observable'

export const epics: CoreEpic[] = [
  ...coreEpics, //
]

export const rootEpic = combineEpics<CoreAction, CoreAction, CoreState, CoreDependencies>(...epics)
