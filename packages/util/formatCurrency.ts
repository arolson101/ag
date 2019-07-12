import { CurrencyCode } from 'currency-code-map'
import { InjectedIntl } from 'react-intl'

export const formatCurrency = (
  intl: InjectedIntl,
  value: number | string,
  currency: CurrencyCode
) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return intl.formatNumber(n, {
    style: 'currency',
    currency,
    // currencyDisplay: 'symbol',
  })
}
