import { stringComparer } from '@ag/util'
import { code, codes } from 'currency-codes'
import getSymbolFromCurrency from 'currency-symbol-map'
import { SelectFieldItem } from '../context'

export const currencies = codes().map(code)
export const currencyItems: SelectFieldItem[] = currencies
  .map(c => ({
    label: `${c.code} (${getSymbolFromCurrency(c.code) || c.code}) - ${c.currency}`,
    value: c.code,
  }))
  .sort((a, b) => stringComparer(a.label, b.label))
