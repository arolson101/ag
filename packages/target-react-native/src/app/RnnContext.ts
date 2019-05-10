import { CoreStore } from '@ag/core/reducers'
import { Options } from 'react-native-navigation'

export interface RnnContext {
  store: CoreStore
}

export type RnnOptionsHandler = (context: RnnContext) => Options
