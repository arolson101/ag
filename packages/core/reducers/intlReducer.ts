import { IntlProvider } from 'react-intl'
import { CoreAction } from '../actions'
import { IntlContext } from '../context'

export type IntlState = IntlContext

export const defaultState: IntlState = new IntlProvider({ locale: 'en' }).getChildContext().intl

export const intlSelectors = {
  intl: (state: IntlState) => state,
  locale: (state: IntlState) => state.locale,
}

export const intl = (state: IntlState = defaultState, action: CoreAction): IntlState => {
  switch (action.type) {
    default:
      return state
  }
}
