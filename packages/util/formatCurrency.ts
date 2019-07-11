import { InjectedIntl } from 'react-intl'

export const formatCurrency = (intl: InjectedIntl, value: string) => {
  return intl.formatNumber(parseFloat(value), {
    style: 'currency',
    currency: 'USD',
    // currencyDisplay: 'symbol',
  })
}
