import { CoreEpic } from './CoreEpic'
import { dbEpics } from './dbEpics'
import { deleteEpics } from './deleteEpics'
import { settingsEpics } from './settingsEpics'

export const coreEpics: CoreEpic[] = [
  ...dbEpics, //
  ...deleteEpics,
  ...settingsEpics,
]
