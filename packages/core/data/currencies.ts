import { stringComparer } from '@ag/util'
import assert from 'assert'
import countryToCurrency, { CountryCode, CurrencyCode } from 'currency-code-map'
import { code, codes } from 'currency-codes'
import getSymbolFromCurrency from 'currency-symbol-map'
import LocaleCode from 'locale-code'
import { SelectFieldItem } from '../context'

export const currencies = codes().map(code)

export const currencyItems: SelectFieldItem[] = currencies
  .map(c => ({
    label: `${c.code} (${getSymbolFromCurrency(c.code) || c.code}) - ${c.currency}`,
    value: c.code,
  }))
  .sort((a, b) => stringComparer(a.label, b.label))

export const currencyForLocale = (locale: string): CurrencyCode => {
  const countryCode = LocaleCode.getCountryCode(locale) as CountryCode
  assert(countryCode in countryToCurrency)
  return countryToCurrency[countryCode]
}

export const currencySymbol = (c: CurrencyCode) => getSymbolFromCurrency(code(c).code)
