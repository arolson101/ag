import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

interface GetIntlProviderProps {
  children: (intl: InjectedIntl) => React.ReactNode
}
export const GetIntlProvider = injectIntl<GetIntlProviderProps>(({ intl, children }) => (
  <>{children(intl)}</>
))
GetIntlProvider.WrappedComponent.displayName = 'GetIntlProvider'
