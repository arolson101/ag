import { ApolloError } from 'apollo-client'
import React, { useContext, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { CoreContext, IntlContext, UiContext, useIntl, useUi } from '../context'

interface Props {
  error: undefined | Error | Error[] | ReadonlyArray<Error>
}

const show = (ui: UiContext, intl: IntlContext, errors: Props['error']) => {
  if (!errors) {
    return null
  }

  if (errors instanceof ApolloError) {
    errors = errors.graphQLErrors.length ? errors.graphQLErrors : [errors]
  } else if (errors instanceof Error) {
    errors = [errors]
  }

  const { alert } = ui

  alert({
    title: intl.formatMessage(messages.error),
    body: (errors as Error[]).map(e => e.message).join('\n'),
    confirmText: intl.formatMessage(messages.ok),
    onConfirm: () => undefined,
    error: true,
  })
}

export const ErrorDisplay = Object.assign(
  React.memo<Props>(function _ErrorDisplay({ error }) {
    const intl = useIntl()
    const ui = useUi()
    useEffect(() => {
      show(ui, intl, error)
    }, [error])
    return null
  }),
  {
    displayName: 'ErrorDisplay',
    show,
  }
)

const messages = defineMessages({
  empty: {
    id: 'ErrorDisplay.empty',
    defaultMessage: ' ',
  },
  error: {
    id: 'ErrorDisplay.error',
    defaultMessage: 'Error',
  },
  ok: {
    id: 'ErrorDisplay.ok',
    defaultMessage: 'Ok',
  },
})
