import { CurrencyCode } from 'currency-code-map'
import LocaleCode from 'locale-code'
import { IntlProvider } from 'react-intl'
import { CoreAction } from '../actions'
import { IntlContext } from '../context'
import { currencyForLocale } from '../data'

export interface IntlState {
  intl: IntlContext
  currency: CurrencyCode
}

const getIntl = (localeCode: string): IntlContext => {
  const locale = LocaleCode.getLanguageName(localeCode)
  return new IntlProvider({ locale }).getChildContext().intl
}

export const intlStateFromLocale = (locale: string): IntlState => ({
  intl: getIntl(locale),
  currency: currencyForLocale(locale),
})

const defaultState: IntlState = intlStateFromLocale('en-US')

export const intlSelectors = {
  intl: (state: IntlState) => state.intl,
  locale: (state: IntlState) => state.intl.locale,
  currency: (state: IntlState) => state.currency,
}

export const intl = (state: IntlState = defaultState, action: CoreAction): IntlState => {
  switch (action.type) {
    default:
      return state
  }
}
