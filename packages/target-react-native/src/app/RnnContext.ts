import { CoreStore, IntlContext } from '@ag/core'
import { Options } from 'react-native-navigation'

export interface RnnContext {
  store: CoreStore
}

export type RnnOptionsHandler = (context: RnnContext) => Options
