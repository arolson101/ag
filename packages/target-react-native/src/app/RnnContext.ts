import { IntlContext } from '@ag/core'
import { Options } from 'react-native-navigation'

export interface RnnContext {
  intl: IntlContext
}

export type RnnOptionsHandler = (context: RnnContext) => Options
