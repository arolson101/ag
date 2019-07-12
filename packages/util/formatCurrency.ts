import { InjectedIntl } from 'react-intl'

export const formatCurrency = (
  intl: InjectedIntl,
  value: number | string,
  currency: string = 'USD'
) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return intl.formatNumber(n, {
    style: 'currency',
    currency,
    // currencyDisplay: 'symbol',
  })
}
