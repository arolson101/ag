import { CoreEpic } from './CoreEpic'
import { dbEpics } from './dbEpics'

export const coreEpics: CoreEpic[] = [
  ...dbEpics, //
]
