import { CoreAction } from '@ag/core/actions'
import { CoreDependencies } from '@ag/core/context'
import { CoreEpic, coreEpics } from '@ag/core/epics'
import { CoreState } from '@ag/core/reducers'
import { combineEpics } from 'redux-observable'

export const epics: CoreEpic[] = [
  ...coreEpics, //
]

export const rootEpic = combineEpics<CoreAction, CoreAction, CoreState, CoreDependencies>(...epics)
