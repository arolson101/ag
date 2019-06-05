import { useIntl, useSelector, useUi } from '@ag/core/context'
import { selectors } from '@ag/core/reducers'
import React from 'react'
import { defineMessages } from 'react-intl'

interface Props {}

export const LoggedIn = Object.assign(
  React.memo<Props>(({ children }) => {
    const isLoggedIn = useSelector(selectors.isLoggedIn)
    const { Text } = useUi()
    const intl = useIntl()

    if (isLoggedIn) {
      return <>{children}</>
    } else {
      return <Text>{intl.formatMessage(messages.notLoggedIn)}</Text>
    }
  }),
  {
    displayName: 'LoggedIn',
  }
)

const messages = defineMessages({
  notLoggedIn: {
    id: 'LoggedIn.notLoggedIn',
    defaultMessage: 'Not logged in',
  },
})
