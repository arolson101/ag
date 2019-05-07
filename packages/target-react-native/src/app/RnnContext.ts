import { CoreContext, IntlContext } from '@ag/core'
import { Options } from 'react-native-navigation'

export interface RnnContext extends CoreContext {
  intl: IntlContext
}

export type RnnOptionsHandler = (context: RnnContext) => Options
