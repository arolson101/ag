import { CoreEpic } from './CoreEpic'
import { dbEpics } from './dbEpics'
import { settingsEpics } from './settingsEpics'

export const coreEpics: CoreEpic[] = [
  ...dbEpics, //
  ...settingsEpics,
]
